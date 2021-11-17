export const validateLoginAuthBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.email) &&
    isString(body.email) &&
    isDefined(body.password) &&
    isString(body.password)
  );
};

export const validateRegisterAuthBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.username) &&
    isString(body.username) &&
    isDefined(body.email) &&
    isString(body.email) &&
    isDefined(body.password) &&
    isString(body.password)
  );
};

export const validateCreateGroupBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.title) &&
    isString(body.title) &&
    isDefined(body.description) &&
    isString(body.description)
  );
};

export const validateGetGroupAlbumBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.groupId) &&
    isString(body.groupId)
  );
};

export const validateUpdateAlbumBody = (body: any) => {
  return (
    (isDefined(body) &&
      objectLength(body) > 0 &&
      isDefined(body.title) &&
      isString(body.title)) ||
    (isDefined(body.description) && isString(body.description))
  );
};

export const validateCreateAlbumBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.groupId) &&
    isString(body.groupId) &&
    isDefined(body.title) &&
    isString(body.title) &&
    isDefined(body.description) &&
    isString(body.description)
  );
};

export const validateCreatePostBody = (body: any) => {
  return (
    isDefined(body) &&
    objectLength(body) > 0 &&
    isDefined(body.albumId) &&
    isString(body.albumId) &&
    isDefined(body.title) &&
    isString(body.title) &&
    isDefined(body.files) &&
    isArray(body.files) &&
    arrayLength(body.files) > 0 &&
    isDefined(body.body) &&
    isString(body.body)
  );
};

export const validateUpdatePostBody = (body: any) => {
  return (
    (isDefined(body) && objectLength(body) > 0) ||
    (isDefined(body.title) && isString(body.title)) ||
    (isDefined(body.files) &&
      isArray(body.files) &&
      arrayLength(body.files) > 0) ||
    (isDefined(body.body) && isString(body.body))
  );
};

export const isString = (string: any) => {
  return typeof string === 'string' || string instanceof String;
};

export const isDefined = (param: any) => {
  if (param) {
    return true;
  }
  return false;
};

export const objectLength = (data: Object) => {
  let length = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      length++;
    }
  }

  return length;
};

export const isArray = (data: any) => {
  return Array.isArray(data);
};

export const arrayLength = (data: any[]) => {
  return data.length;
};
