import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { addHours, addMinutes, startOfDay } from 'date-fns';
import { catchError, delay, map, Subject, tap } from 'rxjs';
import {
  FetchPickingCalendarSettingsGQL,
  UpdatePickingCalendarSettingsGQL,
} from 'src/app/graphql/pick.graphql-gen';
import { users } from './picker-manage.server';
import { v4 as uuidv4 } from 'uuid';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'event-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'eventTemplate.html',
})
export class EventTemplateComponent implements OnInit {
  viewDate = new Date();
  users = users;
  isLoading = false;
  isOverlap = false;

  listOfColumn = [
    {
      title: 'Type',
      compare: (a: CalendarEvent, b: CalendarEvent) =>
        a.meta.user.id - b.meta.user.id,
      priority: 4,
    },

    {
      title: 'Starts at',
      compare: (a: CalendarEvent, b: CalendarEvent) =>
        a.start.getTime() - b.start.getTime(),
      priority: 3,
    },

    {
      title: 'Ends at',
      compare: (a: CalendarEvent, b: CalendarEvent) =>
        a.end.getTime() - b.end.getTime(),
      priority: 2,
    },
    {
      title: 'Points',
      compare: (a: CalendarEvent, b: CalendarEvent) =>
        Number(a.title) - Number(b.title),
      priority: 1,
    },
    {
      title: 'Remove',
      priority: false,
    },
  ];

  constructor(
    private fetchEvent: FetchPickingCalendarSettingsGQL,
    private uploadSetting: UpdatePickingCalendarSettingsGQL,
    private message: NzMessageService
  ) {}
  events: CalendarEvent[] = [];

  fetch$;
  ngOnInit(): void {
    this.fetch$ = this.fetchEvent.fetch().pipe(
      map((res) => {
        const array = res.data.fetchPickingCalendarSettings.split(/\r?\n/);
        array.forEach((ele) => {
          if (!ele) {
            return;
          }
          const setting = JSON.parse(ele);
          const event = {
            title: setting.point,
            color: users[setting.type].color,
            start: addMinutes(
              addHours(startOfDay(new Date()), setting.startHour),
              setting.startMin
            ),
            end: addMinutes(
              addHours(startOfDay(new Date()), setting.endHour),
              setting.endMin
            ),
            meta: {
              user: users[setting.type],
              id: uuidv4(),
            },
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
          };
          this.events.push(event);
        });
        return true;
      })
    );
  }

  async eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent) {
    //check if the new data is in one day
    await delay(10);
    this.isOverlap = false;
    if (newStart.getHours() > newEnd.getHours()) {
      return;
    }
    //check time overlap
    this.events.some((ele) => {
      if (ele.meta.id === event.meta.id) {
        return false;
      }
      if (ele.meta.user === event.meta.user) {
        if (ele.start < newEnd && newStart < ele.end) {
          this.isOverlap = true;
          return true;
        }
      }
      return false;
    });
    if (this.isOverlap) {
      return;
    }
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  userChanged({ event, newUser }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }

  refresh = new Subject<void>();

  refreshCalendar() {
    this.events = [...this.events];
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: '1',
        start: addMinutes(addHours(startOfDay(new Date()), 0), 0),
        end: null,
        color: users[0].color,
        meta: {
          user: users[0],
          id: uuidv4(),
        },
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  checkTimeValid(events: CalendarEvent[]): boolean {
    //create 2D array
    const twoDArray = new Array(users.length);
    for (let i = 0; i < users.length; i++) {
      twoDArray[i] = [];
    }
    let isValid = true;
    events.forEach((ele) => {
      if (ele.start > ele.end) {
        this.message.error('Start time After end time!');
        isValid = false;
      }
      const i = ele.meta.user.id;
      const j = twoDArray[i].length;
      twoDArray[i][j] = ele;
    });
    for (let type = 0; type < users.length; type++) {
      const events = twoDArray[type];
      if (events.length > 1) {
        events.sort((i1, i2) => Number(i1.start.getTime() - i2.end.getTime()));
        for (let i = 0; i < events.length - 1; i++) {
          if (events[i].end > events[i + 1].start) {
            this.message.error('Time Overlap!');
            return false;
          }
        }
      }
    }
    return isValid;
  }

  uploadSetting$;
  upload(): void {
    if (!this.events.length) {
      return;
    }
    let isValid = !this.events.some((event) => {
      if (!event.title || !event.end || !event.start) {
        this.message.error('Empty Field!');
        return true;
      }
      return false;
    });
    isValid = this.checkTimeValid(this.events);
    if (!isValid) {
      return;
    }
    this.isLoading = true;
    let events = '';
    this.events.forEach((res) => {
      const obj = {};
      obj['point'] = res.title;
      obj['type'] = res.meta.user.id;
      obj['startHour'] = res.start.getHours();
      obj['startMin'] = res.start.getMinutes();
      obj['endHour'] = res.end.getHours();
      obj['endMin'] = res.end.getMinutes();
      const setting = JSON.stringify(obj) + '\n';
      events += setting;
    });
    this.uploadSetting$ = this.uploadSetting.mutate({ events }).pipe(
      tap(() => {
        this.isLoading = false;
        this.message.success('Upload Successful');
      }),
      catchError((err) => {
        this.isLoading = false;
        this.message.error(err.message);
        return err;
      })
    );
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
}
