#pragma once

#include <eosiolib/eosio.hpp>
#include <string>

using std::string;
using eosio::indexed_by;
using eosio::const_mem_fun;

struct [[eosio::table]] studentstb {

    uint64_t    std_id;
    eosio::name std_eos_name;
    std::string std_fname;
    std::string std_lname;
    int64_t     avail_rewards;
    uint64_t    total_rewards;

    auto primary_key() const { return std_id; } // getter for primary key

    EOSLIB_SERIALIZE(studentstb, (std_id)(std_eos_name)(std_fname)(std_lname)(avail_rewards)(total_rewards))
};
typedef eosio::multi_index<"studentstb"_n, studentstb> students_index;

struct [[eosio::table]] teacherstb {

    uint64_t    tearcher_id;
    eosio::name tearcher_eos_id;
    std::string teacher_fname;
    std::string teacher_lname;
    auto primary_key() const { return tearcher_id; } // getter for primary key

    EOSLIB_SERIALIZE(teacherstb, (tearcher_id)(tearcher_eos_id)(teacher_fname)(teacher_lname))
};
typedef eosio::multi_index<"teacherstb"_n, teacherstb> teacher_index;

struct [[eosio::table]] stdcoursestb {

    uint64_t    stdcourseid;
    uint64_t    course_id;
    uint64_t    std_id;
    uint64_t    enrolled;
    uint64_t    teacherapp;
    uint64_t    sponsorapp;
    auto primary_key() const { return stdcourseid; } // getter for primary key

    EOSLIB_SERIALIZE(stdcoursestb, (stdcourseid)(course_id)(std_id)(enrolled)(teacherapp)(sponsorapp))
};
typedef eosio::multi_index<"stdcoursestb"_n, stdcoursestb> stdcoursestb_index;

struct [[eosio::table]] coursestb {

    uint64_t    course_id;
    uint64_t    teacher_id;
    std::string course_name;
    std::string course_desc;
    uint64_t    duration;
    int64_t     rewards;
    int64_t     total_avail;
    auto primary_key() const { return course_id; } // getter for primary key

    EOSLIB_SERIALIZE(coursestb, (course_id)(teacher_id)(course_name)(course_desc)(duration)(rewards)(total_avail))
};
typedef eosio::multi_index<"coursestb"_n, coursestb> courses_index;

struct [[eosio::table]] sponcerstb {

    uint64_t    sponcer_id;
    eosio::name sponcer_eos_id;
    std::string sponcer_name;
    auto primary_key() const { return sponcer_id; } // getter for primary key

    EOSLIB_SERIALIZE(sponcerstb, (sponcer_id)(sponcer_eos_id)(sponcer_name))
};
typedef eosio::multi_index<"sponcerstb"_n, sponcerstb> sponcer_index;
