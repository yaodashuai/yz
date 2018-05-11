import {queryRule, removeRule, addRule, fetchArticle, fetchList, fetchListCategory, removeArticleItem} from '../services/api';
import {message} from 'antd'

export default {
  namespace: 'articleList',

  state: {
      category:[],
      data:{}
  },

  effects: {
    *fetchCategoryList({payload},{call,put}){
        const response = yield call(fetchListCategory,payload)
        yield put({
            type:'save',
            payload:response
        })
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchArticle, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
      *fetchCategory({payload},{call,put}){
        const response = yield call(fetchList,payload)
        yield put({
            type:'saveCategory',
            payload:response
        })
      },
      *removeItem({ payload }, { call,put }) {
          yield call(removeArticleItem, payload);
          message.success('删除成功!')
          yield put({
              type: 'fetch',
              payload: {
                  page:0,
                  size:10
              },
          });
      },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveCategory(state,{payload}){
        return{
            ...state,
            category:payload.data
        }
      },
    save(state, {payload}) {
        return {
            ...state,
            data:{
                list:payload.data,
                pagination:{
                    total:payload.totalElements,
                    size:10,
                    // current:payload.totalPages
                }
            }
        }
    },
  },
};
