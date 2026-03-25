import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const aboutType = defineType({
  name: "about",
  title: "About Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(2).max(50).error("Please enter a valid name."),
    }),
    defineField({
      name: "professionalTitle",
      title: "Professional Title",
      type: "string",
      description: "Your professional title/role (e.g., 'Publisher & Digital Strategist')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio (Hero section)",
      type: "text",
      description: "Brief introduction that appears in the hero section (max 500 characters)",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "text",
      description: "Your website's core mission and purpose",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "bio",
      title: "Full Bio",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" }
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" }
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" }
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url"
                  }
                ]
              }
            ]
          }
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility. Describe the image for screen readers.",
          validation: (Rule) => Rule.required()
        }),
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "services",
      title: "Our Services",
      type: "array",
      description: "List of advertising and content services you offer",
      of: [
        {
          type: "object",
          name: "service",
          title: "Service",
          fields: [
            {
              name: "title",
              title: "Service Title",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "icon",
              title: "Icon",
              type: "image",
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                  description: "Icon description for accessibility",
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: "expertiseAreas",
      title: "Our Expertise",
      type: "array",
      description: "Areas of specialization for your content and advertising",
      of: [
        {
          type: "object",
          name: "expertiseArea",
          title: "Expertise Area",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule: any) => Rule.required()
            },
          ]
        }
      ]
    }),
    defineField({
      name: "stats",
      title: "Key Statistics",
      type: "object",
      description: "Impressive stats about your blog/reach",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Stat Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (Rule) => Rule.required()
                }),
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                  validation: (Rule) => Rule.required()
                }),
                defineField({
                  name: "description",
                  title: "Optional Description",
                  type: "string",
                })
              ]
            },
          ]
        })
      ]
    }),
    defineField({
      name: "contentApproach",
      title: "Our Content Approach",
      type: "array",
      description: "How you create and curate content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" }
          ],
          lists: [
            { title: "Bullet", value: "bullet" }
          ]
        }
      ]
    }),
    defineField({
      name: "advertisingOptions",
      title: "Advertising Options",
      type: "array",
      description: "Details about your advertising services",
      of: [
        {
          type: "object",
          name: "adOption",
          title: "Advertising Option",
          fields: [
            {
              name: "title",
              title: "Option Title",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "benefits",
              title: "Key Benefits",
              type: "array",
              of: [{ type: "string" }]
            },
            {
              name: "cta",
              title: "Call to Action",
              type: "string",
              description: "e.g., 'Contact us for rates'"
            }
          ]
        }
      ]
    }),
    defineField({
      name: "testimonials",
      title: "Client Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonial",
          title: "Testimonial",
          fields: [
            {
              name: "quote",
              title: "Quote",
              type: "text",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "authorName",
              title: "Author Name",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "authorTitle",
              title: "Author Title/Position",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "authorCompany",
              title: "Author Company",
              type: "string",
            },
            {
              name: "authorImage",
              title: "Author Image",
              type: "image",
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                  description: "Important for SEO and accessibility",
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      description: "Key members of your content/advertising team",
      of: [
        {
          type: "object",
          name: "teamMember",
          title: "Team Member",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "role",
              title: "Role",
              type: "string",
              validation: (Rule: any) => Rule.required()
            },
            {
              name: "bio",
              title: "Bio",
              type: "text",
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true
              },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                }
              ]
            },
            {
              name: "socialLinks",
              title: "Social Links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "platform",
                      title: "Platform",
                      type: "string",
                    },
                    {
                      name: "url",
                      title: "URL",
                      type: "url",
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      description: "For SEO (max 160 characters)",
      validation: (Rule) => Rule.required().max(160)
    }),
    defineField({
      name: "blogTitle",
      title: "Blog Title",
      type: "string",
      description: "Used in page title",
      validation: (Rule) => Rule.required()
    })
  ],
});