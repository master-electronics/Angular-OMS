import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { addHours, startOfDay } from 'date-fns';
import { map, Subject } from 'rxjs';
import { FetchPickingCalendarSettingsGQL } from 'src/app/graphql/pick.graphql-gen';
import { users } from './picker-manage.server';

@Component({
  selector: 'event-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'eventTemplate.html',
})
export class EventTemplateComponent implements OnInit {
  viewDate = new Date();
  users = users;

  constructor(private fetchEvent: FetchPickingCalendarSettingsGQL) {}
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
            start: addHours(startOfDay(new Date()), setting.start),
            end: addHours(startOfDay(new Date()), setting.end),
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
        start: addHours(startOfDay(new Date()), 1),
        end: addHours(startOfDay(new Date()), 2),
        color: {
          primary: '#ad2121',
          secondary: '#FAE3E3',
        },
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

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
}
