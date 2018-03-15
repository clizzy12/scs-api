import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';

import { PublicationType, ProfileType } from './publications';
import { NewsType } from './news';
import { EventsType } from './events';
import { CoursesType } from './courses';
import { MemberPositionType } from './position';

import { getEventsWithTag } from '../data/events'
import { getNewsWithTag } from '../data/news'
import CoursesData from '../data/courses.js'
import ProfileData from '../data/profile.js'
import PublicationData from '../data/publications.js'
import getCurrentSemesterCode from '../data/semesterCode';

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  description: 'Available properties for SCS members',
  fields: () => ({
    andrew_id: { type: GraphQLString },
    biography: { type: GraphQLString },
    display_email: { type: GraphQLString },
    display_name: { type: GraphQLString },
    email: { type: GraphQLString },
    family_name: { type: GraphQLString },
    fax_phone: { type: GraphQLString },
    given_name: { type: GraphQLString },
    homepage_url: { type: GraphQLString },
    image_url: { type: GraphQLString },
    is_alum: { type: GraphQLString },
    middle_name: { type: GraphQLString },
    name_suffix: { type: GraphQLString },
    phone_area_code: { type: GraphQLString },
    phone_area_code_secondary: { type: GraphQLString  },
    phone_exchange: { type: GraphQLString  },
    phone_extension: { type: GraphQLString },
    phone_extension_secondary: { type: GraphQLString },
    positions: { 
      type: new GraphQLList(MemberPositionType) 
    },
    hr_relationship: { type: GraphQLString },
    hr_relationship_class: { type: GraphQLString },
    hr_relationship_desc: { type: GraphQLString },
    research_areas: { type: new GraphQLList(MemberResearchAreasType) },
    phone_full: {
      type: GraphQLString,
      resolve: function(member){
        return `(${member.phone_area_code}) ${member.phone_exchange} - ${member.phone_extension}`
      }
    },
    phone_full_call: {
      type: GraphQLString,
      resolve: function(member){
        return `${member.phone_area_code}${member.phone_exchange}${member.phone_extension}`
      }
    },
    scid: { type: GraphQLString },
    scs_id: { type: GraphQLString },
    scs_email: { type: GraphQLString },
    scs_relationship_desc: { type: GraphQLString },
    scs_relationship_class: { type: GraphQLString },
    scs_relationship_subclass: { type: GraphQLString },
    profile: {
      type: new GraphQLList(ProfileType),
      resolve: function(args) {
        if(args.scid)
          return ProfileData
            .find({
              scid :`${args.scid}`
            })
            .then((data) => data)
            .catch(err =>  err)
      }
    },
    publications: {
      type: new GraphQLList(PublicationType),
      resolve: function(args) {
        if(args.scid)
          return PublicationData
            .find({
              scid :`${args.scid}`,
              pub_year: { $exists: true },
              authors: { $exists: true }
            })
            .then((data) => data)
            .catch(err =>  err)
      }
    },
    news: {
      type: new GraphQLList(NewsType),
      args: {
        limit: { type: GraphQLInt }
      },
      resolve: function(parent, args) {
        return getNewsWithTag(parent.scid, args);
      }
    },
    events: {
      type: new GraphQLList(EventsType),
      args: {
        limit: { type: GraphQLInt }
      },
      resolve: function(parent, args){
        return getEventsWithTag(parent.scid, args);
      }
    },
    courses: {
      type: new GraphQLList(CoursesType),
      resolve: function(parent){
        let semester_code = getCurrentSemesterCode();
        return CoursesData
          .find({
            "sections.instructors.scid": `${parent.scid}`,
            "semester_code": `${semester_code}`
          })
          .catch(err => err)
      }
    }
  })
})

export const MemberResearchAreasType = new GraphQLObjectType({
  name: 'MemberResearchAreas',
  description: 'Research Areas For Directory Members',
  fields: () => ({
    area_id: { type: GraphQLString },
    title: { type: GraphQLString }
  })
})

export const BiographiesType = new GraphQLObjectType({
  name: 'Biographies',
  description: 'Biographies for professor',
  fields: () => ({
    _id: { type: GraphQLString },
    andrew_id: { type: GraphQLString },
    biography: { type: GraphQLString },
    department: { type: GraphQLString },
    email: { type: GraphQLString },
    homepage_url: { type: GraphQLString },
    name: { type: GraphQLString },
    image_url: { type: GraphQLString },
    title: { type: GraphQLString },
    scid: { type: GraphQLString },
  })
})

export const DirectoryAggregateType = new GraphQLObjectType({
  name: 'DirectoryAggregate',
  description: 'Aggregation of fields',
  fields: () => ({
    _id: { type: GraphQLString }
  })
})
