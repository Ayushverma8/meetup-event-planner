import expect from 'expect';
import * as types from '../constants';
import signupReducer, { initialState } from '../reducer';

describe('signupReducer', () => {
  it('returns the initial state', () => {
    expect(
      signupReducer(undefined, {})
    ).toEqual(initialState);
  });
  it('should handle reducer for SIGNUP_SHOW_ERROR', () => {
    const error = 'An error has occured';
    const stateBefore = {
      isLoading: true,
      error: null,
    };
    const stateAfter = {
      isLoading: false,
      error,
    };
    expect(
      signupReducer(stateBefore, {
        type: types.SIGNUP_SHOW_ERROR,
        error,
      })
    ).toEqual(stateAfter);
  });
  it('should handle reducer for SIGNUP_SHOW_MESSAGE', () => {
    const message = 'A message has occured';
    const stateBefore = {
      isLoading: true,
      message: null,
    };
    const stateAfter = {
      isLoading: false,
      message,
    };
    expect(
      signupReducer(stateBefore, {
        type: types.SIGNUP_SHOW_MESSAGE,
        message,
      })
    ).toEqual(stateAfter);
  });
  it('should handle reducer for SIGNUP_CLEAR_ERROR', () => {
    const stateBefore = {
      error: 'An error has occured',
    };
    const stateAfter = {
      error: null,
    };
    expect(
      signupReducer(stateBefore, {
        type: types.SIGNUP_CLEAR_ERROR,
      })
    ).toEqual(stateAfter);
  });
  it('should handle reducer for SIGNUP_CLEAR_MESSAGE', () => {
    const stateBefore = {
      message: 'Thank you for signing up',
    };
    const stateAfter = {
      message: null,
    };
    expect(
      signupReducer(stateBefore, {
        type: types.SIGNUP_CLEAR_MESSAGE,
      })
    ).toEqual(stateAfter);
  });
  it('should handle reducer for SIGNUP_SET_LOADING', () => {
    const stateBefore = {
      isLoading: false,
    };
    const stateAfter = {
      isLoading: true,
    };
    expect(
      signupReducer(stateBefore, {
        type: types.SIGNUP_SET_LOADING,
      })
    ).toEqual(stateAfter);
  });
  it('should handle reducer for TOGGLE_SIGNUP_TIPS', () => {
    const isShowing = true;
    const stateBefore = {
      isShowingTips: false,
    };
    const stateAfter = {
      isShowingTips: isShowing,
    };
    expect(
      signupReducer(stateBefore, {
        type: types.TOGGLE_SIGNUP_TIPS,
        isShowing,
      })
    ).toEqual(stateAfter);
  });
});
