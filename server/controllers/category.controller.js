const _ = require('lodash');
const Category = require('../models/category.model');

/**
 * 创建分类
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.create = async ctx => {
  // ctx.sanitizeBody('isHome').toBoolean();
  // ctx.sanitizeBody('state').toBoolean();
  ctx.checkBody({
    'uid': {
      optional: true,
      isMongoId: { errIorMessage: 'uid 需为 mongoId' },
    },
    'isHome': {
      optional: true,
      isBoolean: { errorMessage: 'isHome 需为 Boolean' }
    },
    'name': {
      notEmpty: {
        options: [true],
        errorMessage: 'name 不能为空'
      },
      isString: { errorMessage: 'name 需为 String' },
    },
    'path': {
      notEmpty: {
        options: [true],
        errorMessage: 'path 不能为空'
      },
      matches: {
        options: [/^[A-z]+$/],
        errorMessage: 'path 格式不正确'
      }
    },
    'state': {
      optional: true,
      isBoolean: { errorMessage: 'state 需为 Boolean' }
    },
    'sort': {
      optional: true,
      isNumber: { errorMessage: 'sort 为 Number' }
    },
    'template': {
      optional: true,
      isMongoId: { errIorMessage: 'template 需为 mongoId' },
    },
    'keywords': {
      optional: true,
      inArray: {
        options: ['isString'],
        errorMessage: 'keywords 内需为 string'
      },
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为 String' },
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    await Category._save({ input: ctx.request.body });
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 更新分类
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.update = async ctx => {
  ctx.checkBody({
    'uid': {
      optional: true,
      isMongoId: { errIorMessage: 'uid 需为 mongoId' },
    },
    'isHome': {
      optional: true,
      isBoolean: { errorMessage: 'isHome 需为 Boolean' }
    },
    'name': {
      optional: true,
      isString: { errorMessage: 'name 需为 String' },
    },
    'state': {
      optional: true,
      isBoolean: { errorMessage: 'state 需为 Boolean' }
    },
    'sort': {
      optional: true,
      isNumber: { errorMessage: 'sort 为 Number' }
    },
    'keywords': {
      optional: true,
      inArray: {
        options: ['isString'],
        errorMessage: 'keywords 内需为 string'
      },
    },
    'description': {
      optional: true,
      isString: { errorMessage: 'description 需为 String' },
    }
  });

  ctx.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' }
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    await Category._save({ _id: ctx.params._id, input: ctx.request.body });
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 查询单个分类
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.one = async ctx => {
  ctx.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' }
    }
  });

  if (ctx.validationErrors()) return null;

  try {
    const call = await Category.findById(ctx.params._id)
      .select('uid name path state sort keywords description')
      .lean();
    call ? ctx.pipeDone(call) : ctx.pipeFail('查询失败', 'BN99');
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 查询分类列表
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.list = async ctx => {
  try {
    const call = await Category._list();
    ctx.pipeDone(call);
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 获取分类树
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.tree = async ctx => {
  try {
    const call = await Category._tree();
    ctx.pipeDone(call);
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * 删除分类
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.delete = async ctx => {
  ctx.checkParams({
    '_id': {
      notEmpty: {
        options: [true],
        errorMessage: '_id 不能为空'
      },
      isMongoId: { errorMessage: '_id  需为 mongoId' }
    },
  });

  if (ctx.validationErrors()) return null;

  try {
    await Category._remove(ctx.params._id);
    ctx.pipeDone();
  } catch(e) {
    ctx.pipeFail(e);
  }
};

/**
 * [description]
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
exports.multi = async ctx => {
  ctx.checkBody({
    'type': {
      notEmpty: {
        options: [true],
        errorMessage: 'type 不能为空'
      },
      isIn: {
        options: [['remove', 'add', 'update']],
        errorMessage: 'type 必须为 remove/add/update'
      }
    },
    'multi': {
      optional: true,
      inArray: {
        options: ['isMongoId'],
        errorMessage: 'multi 内需为 mongoId'
      }
    },
  });

  if (ctx.validationErrors()) return null;

  try {
    const { multi, type } = ctx.request.body;

    if (type === 'remove') {
      await Category._remove(multi);
      ctx.pipeDone();
    } else {
      ctx.pipeFail(`暂无${type}操作`,'BN99');
    }
  } catch(e) {
    ctx.pipeFail(e);
  }
};