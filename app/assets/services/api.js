import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}
export async function fetchArticle(params) {
    return request(`/api/articles?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/users/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/users/sign-up', {
    method: 'POST',
    body: params,
  });
}
export async function createClassification(params) {
    return request('/api/categories', {
        method: 'POST',
        body: params,
    });
}
export async function removeItem(params) {
    return request(`/api/categories/${params.articleCategoryId}`, {
        method: 'DELETE',

    });
}
export async function removeArticleItem(params) {
    return request(`/api/categories-articles/${params.articleCategoryId}/articles/${params.articleId }`, {
        method: 'DELETE',
    });
}
export async function updataClassification(params) {
    return request(`/api/categories/${params.categoryId}`,{
        method:'PUT',
        body:params
    })
}
export async function fetchList(params) {
    return request(`/api/categories?${stringify(params)}`, );
}
export async function updateauthToken(params) {
    return request(`/api/users/new/token`, );
}
export async function fetchListCategory(params) {
    return request(`/api/categories-articles/${params.categoryId}/articles?${stringify(params)}`, );
}
export async function getArticleContent(params) {
    return request(`/api/categories/${params.articleCategoryId}`, );
}

export async function queryNotices() {
  return request('/api/notices');
}
export async function getQnToken() {
    return request('/upload-token');
}
