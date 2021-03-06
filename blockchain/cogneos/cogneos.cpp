#include "cogneos.hpp"
#include "students.cpp"
#include "courses.cpp"
#include "teachers.cpp"
#include "stdcourses.cpp"

using namespace eosio;

class [[eosio::contract]] cogneos : public eosio::contract 
{
    public:
    cogneos(name receiver, name code,  datastream<const char*> ds):contract(receiver, code, ds), _students(_self), _courses(_self), _teachers(_self),_stdcourses(_self){}
    
    [[eosio::action]]
    void addstudent(eosio::name user, std::string std_fname, std::string std_lname)
    {
        _students.addstudent(user, std_fname, std_lname);
    }

    // [[eosio::action]]
    // void updatestd(eosio::name user_account, std::string std_fname, std::string std_lname)    
    // {
    //     _students.updatestudent(user_account, std_fname, std_lname);
    // }

    [[eosio::action]]
    void coursecomp(eosio::name from_account, eosio::name to_account, uint64_t rewards, uint64_t courseid)
    {
        _students.coursecompleted(from_account, to_account, rewards);
    }
    [[eosio::action]]
    void addcourse(eosio::name user, uint64_t teacher_id, std::string course_name, std::string course_desc, uint64_t duration, uint64_t reward)
    {
        _courses.addcourse(user, teacher_id, course_name, course_desc, duration, reward);
    }

    [[eosio::action]]
    void updatetotava(eosio::name user, uint64_t course_id, uint64_t reward)
    {
        _courses.updatetotava(user, course_id, reward);
    }

    [[eosio::action]]
    void deletecourse(eosio::name user, uint64_t course_id)
    {
        _courses.deletecourse(user, course_id);
    }

    [[eosio::action]]
    void addteacher(eosio::name user, std::string teacher_fname, std::string teacher_lname)
    {
        _teachers.addteacher(user, teacher_fname, teacher_lname);
    }

    [[eosio::action]]
    void sponsorcheck(eosio::name user, uint64_t stdcourseid)
    {
        _stdcourses.sponsorcheck(user, stdcourseid);
    }

    [[eosio::action]]
    void teachercheck(eosio::name user, uint64_t stdcourseid)
    {
        _stdcourses.teachercheck(user, stdcourseid);
    }

    [[eosio::action]]
    void enrollcourse(eosio::name user, uint64_t course_id, std::string course_name, uint64_t std_id)
    {
        _stdcourses.enrollcourse(user, course_id, course_name, std_id);
    }

    [[eosio::action]]
    void markcompleted(eosio::name user, uint64_t stdcourseid)
    {
        _stdcourses.markcompleted(user, stdcourseid);
    }

    [[eosio::action]]
    void delstdcourse(eosio::name user, uint64_t stdcourseid)
    {
        _stdcourses.delstdcourse(user, stdcourseid);
    }

    [[eosio::action]]
    void addhours(eosio::name user, uint64_t stdcourseid, uint64_t hours)
    {
        _stdcourses.addhours(user, stdcourseid, hours);
    }

    [[eosio::action]]
    void unlockreward(eosio::name user_account, uint64_t stdcourseid)
    {
        _stdcourses.unlockreward(user_account, stdcourseid);
    }

    private:
    students    _students;
    courses     _courses;
    teachers    _teachers;
    stdcourses  _stdcourses;
    
};     

EOSIO_DISPATCH(cogneos, (addstudent)(coursecomp)
                        (addcourse)(deletecourse)(updatetotava)
                        (addteacher)
                        (enrollcourse)(markcompleted)(teachercheck)(sponsorcheck)(delstdcourse)(addhours)(unlockreward))