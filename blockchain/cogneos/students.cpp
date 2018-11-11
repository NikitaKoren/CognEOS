#include "cogneos.hpp"

class students {
public:
    students(eosio::name self): _students(self, self.value){}

    void addstudent(eosio::name user, std::string std_fname, std::string std_lname)
    {
        // for(auto& student : _students)
        // {
        //     eosio_assert(user != student.std_eos_name, "Student already exists");
        // }        
        _students.emplace(user, [&] (auto& pstd) {
            pstd.std_id = _students.available_primary_key();
            pstd.std_eos_name = user;
            pstd.std_fname = std_fname;
            pstd.std_lname = std_lname;
            pstd.avail_rewards = 0;
            pstd.total_rewards = 0;
        });
        eosio::print("Student added ", std_fname);
    }

    // void updatestudent(eosio::name user_account, std::string std_fname, std::string std_lname)
    // {
    //     require_auth(user_account);
    //     for(auto& std : _students)
    //     {
    //         if(user_account == std.std_eos_name)
    //         {
    //             _students.modify(std, user_account, [&] (auto& pstd) {
    //                 pstd.std_fname = std_fname;
    //                 pstd.std_lname = std_lname;
    //             });
    //             print("Student Updated ", std_lname);
    //             break;
    //         }
    //     }       
    // }

    void coursecompleted(eosio::name from_account, eosio::name to_account, uint64_t rewards)
    {
        //require_auth(from_account);
            // action(
            // permission_level{ from_account, N(active) },
            // N(eosio.token), N(transfer),
            // std::make_tuple(from_account, to_account, rewards, std::string("reward for course completion"))
            // ).send();
    }

private:
    students_index _students;
};