import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
    'GET /api/article-categories':(req,res) =>{
    res.status(200).send({
        "totalPages": 1,
        "data": [
            {
                "id": 1,
                "code": 0,
                "name": "??",
                "createdAt": "2018-05-02T08:12:35.000+0000",
                "updatedAt": "2018-05-02T08:12:35.000+0000"
            },
            {
                "id": 2,
                "code": 675897,
                "name": "??",
                "createdAt": "2018-05-07T10:48:31.000+0000",
                "updatedAt": "2018-05-07T10:48:31.000+0000"
            },
            {
                "id": 3,
                "code": 4535545,
                "name": "??",
                "createdAt": "2018-05-07T10:48:39.000+0000",
                "updatedAt": "2018-05-07T10:48:39.000+0000"
            },
            {
                "id": 4,
                "code": 65464646,
                "name": "??",
                "createdAt": "2018-05-07T10:48:46.000+0000",
                "updatedAt": "2018-05-07T10:48:46.000+0000"
            },
            {
                "id": 5,
                "code": 434343,
                "name": "??",
                "createdAt": "2018-05-07T10:49:13.000+0000",
                "updatedAt": "2018-05-07T10:49:13.000+0000"
            },
            {
                "id": 6,
                "code": 323,
                "name": "??",
                "createdAt": "2018-05-07T10:49:29.000+0000",
                "updatedAt": "2018-05-07T10:49:29.000+0000"
            },
            {
                "id": 7,
                "code": 574897,
                "name": "??",
                "createdAt": "2018-05-07T10:49:43.000+0000",
                "updatedAt": "2018-05-07T10:49:43.000+0000"
            },
            {
                "id": 8,
                "code": 4543,
                "name": "??",
                "createdAt": "2018-05-07T10:49:53.000+0000",
                "updatedAt": "2018-05-07T10:49:53.000+0000"
            },
            {
                "id": 9,
                "code": 545454,
                "name": "???",
                "createdAt": "2018-05-07T10:51:03.000+0000",
                "updatedAt": "2018-05-07T10:51:03.000+0000"
            },
            {
                "id": 10,
                "code": 6565676,
                "name": "???",
                "createdAt": "2018-05-07T10:51:17.000+0000",
                "updatedAt": "2018-05-07T10:51:17.000+0000"
            }
        ],
        "totalElements": 12
    })
    },
    'POST /api/article-categories': (req,res) =>{
      res.status(200).send({
          "id": 2,
          "code": 43738974,
          "name": "小说",
          "createdAt": "2018-05-07T05:54:53.480+0000",
          "updatedAt": "2018-05-07T05:54:53.480+0000"
      })
    },
    'GET /api/users/new/token':(req,res) =>{
      res.status(200).send('Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsdW9zaGVuZyxudWxsIiwiZXhwIjoxNTI2NjI1NjE4fQ.9zQ8oB_TxpsFCnVdSibkhoD39XNoNsjvg-rtv6TbXFc')
    },
    'GET /api/articles':(req,res) =>{
      res.status(200).send(
          {
              "totalPages": 1,
              "data": [
                  {
                      "id": 2,
                      "username": "luosheng",
                      "title": "llalaal",
                      "content": "??????????????????????????????????????????",
                      "author": "????",
                      "releaseDate": null,
                      "status": "DRAFT",
                      "viewCount": 0,
                      "category": {
                          "id": 2,
                          "code": 675897,
                          "name": "??",
                          "createdAt": "2018-05-07T10:48:31.000+0000",
                          "updatedAt": "2018-05-07T10:48:31.000+0000"
                      },
                      "summary": "??????????????????????????",
                      "source": null,
                      "coverImage": null,
                      "tags": [
                          {
                              "id": 7,
                              "name": "???????",
                              "code": "???????",
                              "createdAt": "2018-05-08T01:44:48.000+0000",
                              "updatedAt": "2018-05-08T01:44:48.000+0000"
                          },
                          {
                              "id": 6,
                              "name": "??i??",
                              "code": "??i??",
                              "createdAt": "2018-05-08T01:44:48.000+0000",
                              "updatedAt": "2018-05-08T01:44:48.000+0000"
                          }
                      ],
                      "createdAt": "2018-05-08T01:44:48.000+0000",
                      "updatedAt": "2018-05-08T01:44:48.000+0000"
                  },
                  {
                      "id": 3,
                      "username": "luosheng",
                      "title": "llalaal",
                      "content": "??????????????????????????????????????????",
                      "author": "????",
                      "releaseDate": null,
                      "status": "DRAFT",
                      "viewCount": 0,
                      "category": {
                          "id": 2,
                          "code": 675897,
                          "name": "??",
                          "createdAt": "2018-05-07T10:48:31.000+0000",
                          "updatedAt": "2018-05-07T10:48:31.000+0000"
                      },
                      "summary": "??????????????????????????",
                      "source": null,
                      "coverImage": null,
                      "tags": [
                          {
                              "id": 8,
                              "name": "??",
                              "code": "??",
                              "createdAt": "2018-05-08T01:46:07.000+0000",
                              "updatedAt": "2018-05-08T01:46:07.000+0000"
                          }
                      ],
                      "createdAt": "2018-05-08T01:46:07.000+0000",
                      "updatedAt": "2018-05-08T01:46:07.000+0000"
                  }
              ],
              "totalElements": 2
          }

      )
    },
    'POST /api/users/login': (req, res) => {
    res.status(200).send({
            "token": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsdW9zaGVuZyxudWxsIiwiZXhwIjoxNTI2NTM0MzA3fQ.kmRFL0rXe0HIRVup33r8Jo1vIx7LGAXIMMC2flTC0Hk",
            "user": {
            "id": 2,
                "username": "luosheng",
                "createdAt": "2018-05-07T05:18:10.000+0000",
                "updatedAt": "2018-05-07T05:18:10.000+0000",
                "roles": [
                {
                    "id": 3,
                    "name": "ROLE_STUDENT",
                    "description": "学生",
                    "createdAt": null,
                    "updatedAt": null
                }
            ]
        }
    });
    },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

export default noProxy ? {} : delay(proxy, 1000);
