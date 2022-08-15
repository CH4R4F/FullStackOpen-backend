exports.generateId = function (data) {
  let id = null;
  do {
    id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  } while (data.some((p) => p.id == id));

  return id;
};
