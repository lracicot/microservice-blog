# DevOps microservice blog: from project to code - part 1

// TODO: Sujet amené
This article is aimed at describing the whole engineering process for the development of a software from the beginning to the end. For this purpose, we will describe a quite simple project: A website with a blog that visitors can browse and editors can add/edit posts.

We'll start by a preliminary analysis that will represent what the customer wants to see as a result. We will then chose a software architecture, define a DevOps development process, plan the projects into different iterations and finally code the project. Where do we start?

# The customer requirements (so far)
Our hypothetical customer told us that they need a website that shows pages and categorized blog posts. Blog posts may contain tags, widgets (for example: embedded videos, a flickr gallery or a custom dynamic widget). They can also contain documents that have a version, history, description and an attached file. The customer also wants to be able to edit the content of its  blog.

# Preliminary analysis

From the customer requirements, we can derive a usual use-case analysis by defining actors and their use-cases.

## Actors
- Visitor
- Editor

## Use cases:

### Visitor
- Visit a page
- List blog post
- Browse post by category or tag
- View a blog post
- View a document informations
- Download a document

### Editor
- Manage posts
- Manage categories
- Manage widgets
- Assign a category to a post
- Assign tags to a post

# Defining the architecture
From the preliminary analysis, a plethora of software architecture can come to mind. Our ideal architecture would satisfy the following:
- It enables the possibility of having different teams to work independently from each other
- It is testable from within a QA server
- It is automatically deployable

## Services
- Post service
- Widget service
- Document service
- Editor client
- Editor API gateway
- Visitor client (the website)
- Visitor API gateway

## Architecture
