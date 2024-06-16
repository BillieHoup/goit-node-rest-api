import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(1).max(20),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  phone: Joi.string()
    .required()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be in the format (XXX) XXX-XXXX",
    }),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string()
    .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be in the format (XXX) XXX-XXXX",
    }),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).messages({
  "boolean.base": "Favorite must be a boolean value",
  "any.required": "Favorite is required",
});
