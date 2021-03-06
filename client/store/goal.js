/* eslint-disable no-alert */
import axios from 'axios'

const SET_GOALS = 'SET_GOALS'
const ADD_GOAL = 'ADD_GOAL'
const DELETE_GOAL = 'DELETE_GOAL'
const UPDATE_GOAL = 'UPDATE_GOAL'

export const setGoals = goals => ({
  type: SET_GOALS,
  goals
})

export const fetchGoals = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/goals')
    if (data) {
      dispatch(setGoals(data))
    } else {
      dispatch(setGoals([]))
    }
  } catch (error) {
    console.error('There was a problem fetching goals!', error)
  }
}

export const addedGoal = goal => ({
  type: ADD_GOAL,
  goal
})

export const addGoal = goalInfo => async dispatch => {
  try {
    if (!goalInfo.detail) {
      alert('Detail is a required field!')
    } else {
      const {data} = await axios.post('/api/goals', goalInfo)
      dispatch(addedGoal(data))
    }
  } catch (error) {
    console.error('There was a problem creating a new goal!', error)
  }
}

export const deletedGoal = goalId => ({
  type: DELETE_GOAL,
  goalId
})

export const deleteGoal = goalId => async dispatch => {
  try {
    await axios.delete(`/api/goals/${goalId}`)
    dispatch(deletedGoal(goalId))
  } catch (error) {
    console.error('There was a problem deleting the goal!', error)
  }
}

export const updatedGoal = (goalId, updateInfo) => ({
  type: UPDATE_GOAL,
  goalId,
  updateInfo
})

export const updateGoal = (goalId, updateInfo) => {
  return async dispatch => {
    try {
      await axios.put(`/api/goals/${goalId}`, updateInfo)
      dispatch(updatedGoal(goalId, updateInfo))
    } catch (error) {
      console.error('There was a problem updating the goal!', error)
    }
  }
}

const initialState = {loading: true, goals: []}

export default function goalsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GOALS:
      return {...state, loading: false, goals: action.goals}
    case ADD_GOAL:
      return {...state, loading: false, goals: [...state.goals, action.goal]}
    case DELETE_GOAL:
      return {
        ...state,
        loading: false,
        goals: [...state.goals].filter(goal => goal.id !== action.goalId)
      }
    case UPDATE_GOAL:
      return {
        ...state,
        loading: false,
        goals: [...state.goals].map(goal => {
          if (goal.id === action.goalId) {
            return {...goal, ...action.updateInfo}
          } else {
            return goal
          }
        })
      }
    default:
      return state
  }
}
