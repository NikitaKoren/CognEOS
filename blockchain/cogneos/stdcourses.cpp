#include "cogneos.hpp"

class stdcourses {
public:

    stdcourses(eosio::name self): _stdcourses(self, self.value){}

    void enrollcourse(eosio::name user, uint64_t course_id, uint64_t std_id)
    {     
        _stdcourses.emplace(user, [&] (auto& pstdcourse) {
            pstdcourse.stdcourseid = _stdcourses.available_primary_key();
            pstdcourse.course_id = course_id;
            pstdcourse.std_id = std_id;
            pstdcourse.enrolled = 1;
            pstdcourse.teacherapp = 0;
            pstdcourse.sponsorapp = 0;
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

private:
    stdcoursestb_index _stdcourses;
};