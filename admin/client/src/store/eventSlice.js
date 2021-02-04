import { createSlice } from "@reduxjs/toolkit";
import eventApi from "api/EventApi";
import { shop } from "config";
const initialState = [];

const events = createSlice({
  name: "events",
  initialState: initialState,
  reducers: {
    AddToEvents: (state, action) => {
      state.push(...action.payload);
    },
    RemoveEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload);
    },
    ActiveRedux: (state, action) => {
      const event = state.findIndex((x) => +x.id === +action.payload);
      if (+state[event].publish === 0) {
        const eventActive = state.findIndex((x) => +x.publish === 1);
        if (eventActive === -1) {
          const activeEvent = async () => {
            state[event].publish = 1;
            await eventApi.active(action.payload, 1);
          };
          activeEvent();
        } else {
          const activeEvent = async () => {
            state[eventActive].publish = 0;
            state[event].publish = 1;
            await eventApi.active(action.payload, 1);
          };
          activeEvent();
        }
      } else {
        const activeEvent = async () => {
          state[event].publish = 0;
          await eventApi.active(action.payload, 0);
        };
        activeEvent();
      }
    },

    RemoveAll: (state, action) => {
      return state.filter((x) => x.id === -1);
    },
    RemoveEventChoose: (state, action) => {
      const deleteChooseEvents = async () => {
        let tempFiles = state.slice(0);
        tempFiles.forEach((event) => {
          if (action.payload.includes(event["id"])) {
            let removeIndex = state
              .map((item) => item["id"])
              .indexOf(event["id"]);
            state.splice(removeIndex, 1);
          }
        });
      };
      deleteChooseEvents();
    },

    AddToEvent: (state, action) => {
      state.push(action.payload);
    },
    UpdateEvent: (state, action) => {
      const NewEvent = action.payload;
      const EventIndex = state.findIndex((event) => event.id === NewEvent.id);
      if (EventIndex >= 0) {
        state[EventIndex] = NewEvent;
      } else {
        console.log("k");
      }
    },
  },
});

const { reducer, actions } = events;
export const {
  AddToEvents,
  RemoveEventChoose,
  RemoveEvent,
  ActiveRedux,
  RemoveAll,
  AddToEvent,
  UpdateEvent,
} = actions;
export default reducer;
