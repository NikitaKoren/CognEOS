#include "cogneos.hpp"

class courses {
public:

    courses(eosio::name self): _courses(self, self.value){}

    void addcourse(eosio::name user, uint64_t teacher_id, std::string course_name, std::string course_desc, uint64_t duration, uint64_t reward)
    {
        for(auto& course : _courses)
        {
            eosio_assert(course_name != course.course_name, "Course already exists");
        }        
        _courses.emplace(user, [&] (auto& pcourse) {
            pcourse.course_id = _courses.available_primary_key();
            pcourse.teacher_id = teacher_id;
            pcourse.course_name = course_name;
            pcourse.course_desc = course_desc;
            pcourse.duration = duration;
            pcourse.rewards = reward;
            pcourse.total_avail = 0;
        });
        eosio::print("Course added ", course_name);
    }

    void deletecourse(eosio::name user, uint64_t course_id)
    {
        require_auth(user);
        auto iterator = _courses.find( course_id );
        eosio_assert(iterator != _courses.end(), "Course does not exist");
        _courses.erase(iterator); 
    }

    void updatetotava(eosio::name user, uint64_t course_id, uint64_t reward)
    {
        require_auth(user);
        auto iterator = _courses.find( course_id );
        eosio_assert(iterator != _courses.end(), "Course does not exist");
        _courses.modify(iterator, user, [&] (auto& course) {
            course.total_avail = course.total_avail + reward;
        });
        eosio::print("Available Bounty Updated ", course_id);
    }

private:
    courses_index _courses;
};