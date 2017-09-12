const _ = require('lodash');
const validator = require('validator');
const Category = require('../models/category.model');

const { SiteInfo, ThemeInfo } = require('../services/site.service');

/**
 * 过滤路由
 * 分类:     /category
 * 内容:     /category/contentId
 * 单页:     /xxxx.html
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const filter = (target = '') => {
  const parts = target.split('/');

  if (parts.length > 2) return false;
  if (parts.length === 2) return validator.isMongoId(parts[1]) ? true : false;
  
  return true;
}

module.exports = async (ctx) => {
  try {
    const { target } = ctx.params;

    // 获取主题
    const theme = await ThemeInfo()._default();
    if (!theme) return ctx.body = '请登录后台设置主题';
    const { alias } = theme;

    const navigation = await Category._navigation();


    if (!filter(target)) return await ctx.render(`${alias}/default-0/404`, {
      siteInfo: {
        title: '404'
      },
      categories: {},
      navigation,
      current: '/404',
      alias: '/themes/default'
    });
    
    // 获取网站信息 
    const siteInfo = await SiteInfo().get();

    // 首页
    if (_.includes([undefined, 'index.html', 'index.htm'], target)) {


      // 获取导航列表
      const navigation = await Category._navigation();

      let current = '/';
      navigation.forEach(item => {
        if (item.isHome) {
          current = item.path
        }
      });


      return await ctx.render('default/default-0/home', {
        siteInfo,
        categories: {},
        navigation,
        current,
        alias: '/themes/default'
      });
    }

    const categories = await Category._path();
  } catch (e) {
    ctx.pipeFail(e, '9999')
  }
};