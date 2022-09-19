import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { addHours, startOfDay } from 'date-fns';
import { User } from './day-view-scheduler.component';

const users: User[] = [
  {
    id: 0,
    name: 'Test 1',
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
  },
  {
    id: 1,
    name: 'Test 2',
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  },
  {
    id: 2,
    name: 'Test 3',
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
  },

  {
    id: 3,
    name: 'Test 3',
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
  },
  {
    id: 4,
    name: 'Test 5',
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  },
  {
    id: 5,
    name: 'Test 6',
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
  },
];

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'template.html',
})
export class PickerManageComponent {
  viewDate = new Date();

  users = users;

  events: CalendarEvent[] = [
    {
      title: 'An event',
      color: users[0].color,
      start: addHours(startOfDay(new Date()), 5),
      meta: {
        user: users[0],
        Point: 3,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      title: 'Another event',
      color: users[1].color,
      start: addHours(startOfDay(new Date()), 2),
      meta: {
        user: users[1],
        Point: 4,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      title: 'A 3rd event',
      color: users[0].color,
      start: addHours(startOfDay(new Date()), 7),
      meta: {
        user: users[0],
        Point: 3,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

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
}
