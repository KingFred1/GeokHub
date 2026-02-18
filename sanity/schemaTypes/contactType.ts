import { defineField, defineType } from "sanity";

export const contactType = defineType({
  name: "contactPage",
    title: "Contact Page",
    type: "document",
    fields: [
        defineField({
            name: "intText",
            title: "Introduction Text",
            type: "string",
        }),
        defineField({
            name: "email",
            title: "Email Adress",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Phone Number",
            type: "string",
        }),
        defineField({
            name: "address",
            title: "Physical Address",
            type: "text",
        }),
        defineField({
            name: "mapEmbedUrl",
            title: "Google Maps Embed URL",
            type: "url",
        }),
        defineField({
            name: "metaDescription",
            title: "Meta Description",
            type: "string",
        }),
    ]
})