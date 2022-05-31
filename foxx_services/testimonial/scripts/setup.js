'use strict';
const db = require('@arangodb').db;

const testimonials = module.context.collectionName("testimonials");

if (!db._collection(testimonials)) {
  db._createDocumentCollection(testimonials);
}

const testimonial_likes = module.context.collectionName("testimonial_likes");

if (!db._collection(testimonial_likes)) {
  db._createDocumentCollection(testimonial_likes);
}