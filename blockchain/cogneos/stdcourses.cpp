#include "cogneos.hpp"

class stdcourses {
public:

    stdcourses(eosio::name self): _stdcourses(self, self.value){}

    void enrollcourse(eosio::name user, uint64_t course_id, std::string course_name, uint64_t std_id)
    {    
        require_auth(user);
        _stdcourses.emplace(user, [&] (auto& pstdcourse) {
            pstdcourse.stdcourseid = _stdcourses.available_primary_key();
            pstdcourse.course_id = course_id;
            pstdcourse.course_name = course_name;
            pstdcourse.std_id = std_id;
            pstdcourse.enrolled = 1;
            pstdcourse.hoursworked = 0;
            pstdcourse.teacherapp = 0;
            pstdcourse.sponsorapp = 0;
        });
    }

    void markcompleted(eosio::name user, uint64_t stdcourseid)
    {
        require_auth(user);
        auto iterator = _stdcourses.find( stdcourseid );
        eosio_assert(iterator != _stdcourses.end(), "Course does not exist");
        _stdcourses.modify(iterator, user, [&] (auto& stdcourse) {
            stdcourse.completed = 1;
        });
    }

    void teachercheck(eosio::name user, uint64_t stdcourseid)
    {
        require_auth(user);
        auto iterator = _stdcourses.find( stdcourseid );
        eosio_assert(iterator != _stdcourses.end(), "Course does not exist");
        _stdcourses.modify(iterator, user, [&] (auto& stdcourse) {
            stdcourse.teacherapp = 1;
        });
    }

    void sponsorcheck(eosio::name user, uint64_t stdcourseid)
    {
        require_auth(user);
        auto iterator = _stdcourses.find( stdcourseid );
        eosio_assert(iterator != _stdcourses.end(), "Course does not exist");
        _stdcourses.modify(iterator, user, [&] (auto& stdcourse) {
            stdcourse.sponsorapp = 1;
        });
    }

    void delstdcourse(eosio::name user, uint64_t stdcourseid)
    {
        require_auth(user);
        auto iterator = _stdcourses.find( stdcourseid );
        eosio_assert(iterator != _stdcourses.end(), "Course does not exist");
        _stdcourses.erase(iterator);
    }

    void addhours(eosio::name user, uint64_t stdcourseid, uint64_t hours)
    {
        require_auth(user);
        auto iterator = _stdcourses.find( stdcourseid );
        eosio_assert(iterator != _stdcourses.end(), "Course does not exist");
        _stdcourses.modify(iterator, user, [&] (auto& stdcourse) {
            stdcourse.hoursworked += hours;
        });
    }

private:
    stdcoursestb_index _stdcourses;
};