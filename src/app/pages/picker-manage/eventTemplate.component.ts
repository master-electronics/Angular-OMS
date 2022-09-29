import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { addHours, addMinutes, startOfDay } from 'date-fns';
import { catchError, map, Subject, tap } from 'rxjs';
import {
  FetchPickingCalendarSettingsGQL,
  UpdatePickingCalendarSettingsGQL,
} from 'src/app/graphql/pick.graphql-gen';
import { users } from './picker-manage.server';

@Component({
  selector: 'event-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'eventTemplate.html',
})
export class EventTemplateComponent implements OnInit {
  viewDate = new Date();
  users = users;
  isLoading = false;

  constructor(
    private fetchEvent: FetchPickingCalendarSettingsGQL,
    private uploadSetting: UpdatePickingCalendarSettingsGQL
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
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
        title: 'New event',
        start: addMinutes(addHours(startOfDay(new Date()), 0), 0),
        end: addMinutes(addHours(startOfDay(new Date()), 1), 0),
        color: users[0].color,
        meta: {
          user: users[0],
          Type: 'Test 1',
        },
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  uploadSetting$;
  upload(): void {
    if (!this.events.length) {
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
      }),
      catchError((err) => {
        this.isLoading = false;
        return err;
      })
    );
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
}
