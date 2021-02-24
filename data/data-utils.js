const getTypeById = ({ type }, types) => types.find(classType => type === classType.type).id;

module.exports = {
  getTypeById
};
