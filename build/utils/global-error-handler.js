"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/global-error-handler.ts
var global_error_handler_exports = {};
__export(global_error_handler_exports, {
  globalErrorHandler: () => globalErrorHandler
});
module.exports = __toCommonJS(global_error_handler_exports);

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Username or password is invalid");
  }
};

// src/utils/global-error-handler.ts
var import_pg = require("pg");
var import_zod = require("zod");
function globalErrorHandler(error, _, reply) {
  if (error instanceof import_zod.ZodError) {
    reply.status(400).send({ message: "Validation error", errors: error.format() });
  }
  if (error instanceof import_pg.DatabaseError) {
    reply.status(400).send({ message: "Database integrity error", errors: error.message });
  }
  if (error instanceof InvalidCredentialsError) {
    reply.status(401).send({ error: error.message });
  }
  return reply.status(500).send("Internal server error");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  globalErrorHandler
});
