#include "cogneos.hpp"

class teachers {
public:
    teachers(eosio::name self): _teachers(self, self.value){}

    void addteacher(eosio::name user, std::string teacher_fname, std::string teacher_lname)
    {
        // for(auto& teacher : _teachers)
        // {
        //     eosio_assert(user != teacher.tearcher_eos_id, "Teacher already exists");
        // }        
        _teachers.emplace(user, [&] (auto& pteacher) {
            pteacher.tearcher_id = _teachers.available_primary_key();
            pteacher.tearcher_eos_id = user;
            pteacher.teacher_fname = teacher_fname;
            pteacher.teacher_lname = teacher_lname;
        });
        eosio::print("Teacher added ", teacher_fname);
    }


private:
    teacher_index _teachers;
};