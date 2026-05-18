import fp from "fastify-plugin";
import { ValidationError } from "../errors/index.js";

function validate({ body, params, query } = {}) {
  return async (request, reply) => {
    try {
      if (body) {
        const parsedBody = body.parse(request.body);
        request.body = parsedBody;
      }

      if (params) {
        const parsedParams = params.parse(request.params);
        request.params = parsedParams;
      }

      if (query) {
        const parsedQuery = query.parse(request.query);
        request.query = parsedQuery;
      }
    } catch (err) {
      if (err.name === "ZodError") {
        const zodIssues = err.issues || err.errors || [];
        const formattedErrors = zodIssues.map((issue) => ({
          path: issue.path ? issue.path.join(". ") : "field",
          message: issue.message,
        }));
        throw new ValidationError("Validation failed", formattedErrors);
      }

      throw err;
    }
  };
}

async function zodValidatorPlugin(fastify, options) {
  fastify.decorate("validate", validate);
}

export default fp(zodValidatorPlugin, {
  name: "zod-validator",
});
