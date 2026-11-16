const paginate = async (
  model,
  filter = {},
  { page = 1, limit = 10, sort = { createdAt: -1 }, populate = '' } = {}
) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  let query = model.find(filter).sort(sort).skip(skip).limit(parsedLimit);

  if (populate) {
    query = query.populate(populate);
  }

  const [docs, totalDocs] = await Promise.all([
    query.lean(),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / parsedLimit);

  return {
    docs,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      totalDocs,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1,
    },
  };
};

module.exports = paginate;
