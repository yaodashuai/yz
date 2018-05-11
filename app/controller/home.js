'use strict';
const Controller = require('egg').Controller;
const qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = 'hL5IH1HsR62_MSIinGiJmfeqJ9Fl4nMyAU2rrhE0'
qiniu.conf.SECRET_KEY = 'AcdkbaLF2HIq42GIcNoJfKNVYfNIRE8xzcke_cyp'
const bucket = 'hikedu-raintown'

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.js');
  }

  async proxy() {
    const ctx = this.ctx;
    // use roadhog mock api first
    // const url = 'http://127.0.0.1:8000' + ctx.path + '?' + ctx.querystring;
      const url = 'https://api.test.hikedu.com' + ctx.url.substring(4);
      const token = this.ctx.request.headers.authorization ? {authorization :this.ctx.request.headers.authorization }:{}
    // const data = this.ctx.method === 'POST' ? {data: this.ctx.request.body} :{}
    const res = await this.ctx.curl(url, {
        method: this.ctx.method,
        data:this.ctx.request.body,
        headers: {
            ...token,
            'Content-Type': 'application/json',
        }
    });
    ctx.body = res.data;
    ctx.status = res.status;
  }

    async token() {
        const putPolicy = new qiniu.rs.PutPolicy({
            scope: bucket
        });
        this.ctx.body = {
            token: putPolicy.uploadToken()
        };
    }


}

module.exports = HomeController;
