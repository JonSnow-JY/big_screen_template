export const checkPhone = (title = "手机号码", rule, value, callback) => {
  let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!value) {
    return callback(new Error(`${title}不能为空`));
  } else if (value.length !== 11) {
    return callback(new Error(`${title}必须为11位`));
  } else if (!reg.test(value)) {
    return callback(new Error(`${title}格式不正确，请检查`));
  } else {
    callback();
  }
};

export const checkPhoneNotRequired = (rule, value, callback) => {
  let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!value) {
    callback();
  } else if (value.length !== 11) {
    callback(new Error("手机号码必须为11位"));
  } else if (!reg.test(value)) {
    callback(new Error("手机号码格式不正确，请检查"));
  } else {
    callback();
  }
};
