import React, { useState, useMemo, useEffect } from 'react';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isBefore,
  parseISO,
  isEqual,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { pt } from 'date-fns/esm/locale';

import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import api from '~/services/api';

import { Container, Time } from './styles';
import { toast } from 'react-toastify';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadSchedule() {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await api.get('schedule', {
          params: { date },
        });

        const data = range.map(hour => {
          const checkDate = setMilliseconds(
            setSeconds(setMinutes(setHours(date, hour), 0), 0),
            0
          );

          const compareDate = utcToZonedTime(checkDate, timezone);
          const appointment = response.data.find(a =>
            isEqual(parseISO(a.date), compareDate)
          );

          return {
            time: `${hour}:00h`,
            past: isBefore(compareDate, new Date()),
            appointment,
          };
        });

        setSchedule(data);
      } catch (error) {
        toast.error('Erro ao buscar agenda. Tente mais tarde!');
        console.tron.log(error);
      }
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>

      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em Aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
