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

// src/routes/delete-participant.ts
var delete_participant_exports = {};
__export(delete_participant_exports, {
  deleteParticipant: () => deleteParticipant
});
module.exports = __toCommonJS(delete_participant_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({ log: ["query"] });

// src/routes/delete-participant.ts
async function deleteParticipant(app) {
  app.withTypeProvider().delete(
    "/participants/:participantId",
    {
      schema: {
        params: import_zod.z.object({
          participantId: import_zod.z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { participantId } = request.params;
      await prisma.participant.delete({
        where: {
          id: participantId
        }
      });
      return reply.status(200).send();
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteParticipant
});
