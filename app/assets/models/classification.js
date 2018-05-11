import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {createClassification, fetchList, fakeSubmitForm, removeItem, getArticleContent,updataClassification} from '../services/api'

export default {
  namespace: 'classification',

  state: {
      list: [],
      newClassification:null,
      data:[],
      contentDate:{},
  },

  effects: {
      *update({payload},{call,put}){
          yield call(updataClassification,payload)
          yield put({
              type:'fetch',
              payload:{
                  page:0,
                  size:10
              }
          })
      },
    *createSubmit({ payload }, { call,put }) {
      const response = yield call(createClassification, payload);
        yield put({
            type: 'saveNewClassification',
            payload: response,
        });
        yield put({
            type:'fetch',
            payload:{
                page:0,
                size:10
            }
        })
    },
    *fetch({ payload }, { call,put }) {
          console.log(payload.page)
      let response = yield call(fetchList, payload);
      yield put({
          type:'saveList',
          payload:response
      })
    },
    *removeItem({ payload }, { call,put }) {
      yield call(removeItem, payload);
      message.success('删除成功!')
        yield put({
            type:'fetch',
            payload:{
                page:0,
                size:10
            }
        })
    },
      *getContent({payload},{call,put}){
      const response = yield call(getArticleContent,payload)
          console.log(response)
          yield put({
              type:'saveContent',
              payload:response
          })
      },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
      saveContent(state,{payload}){
        return{
            ...state,
            contentDate:payload
        }
      },
      saveList(state,{payload}){
        return {
            ...state,
            data:{
               list:payload.data,
                pagination:{
                    total:payload.totalElements,
                    size:10,
                    // current:0
                }
            }
        }
      },
      saveNewClassification(state,{payload}){
        return{
            ...state,
            newClassification:payload
        }
      },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
