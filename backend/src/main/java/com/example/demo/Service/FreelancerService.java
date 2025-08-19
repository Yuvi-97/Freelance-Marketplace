    package com.example.demo.Service;

    import java.util.List;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import com.example.demo.Model.Freelancer;
    import com.example.demo.Repository.FreelancerRepository;

    @Service
    public class FreelancerService {

        @Autowired
        private FreelancerRepository freelancerRepository;

        public Freelancer createFreelancer(Freelancer freelancer) {
            return freelancerRepository.save(freelancer);
        }

        public List<Freelancer> getAllFreelancers() {
            return freelancerRepository.findAll();
        }

        public Freelancer getFreelancerById(Long id) {
            return freelancerRepository.findById(id).orElse(null);
        }

        public Freelancer updateFreelancer(Long id, Freelancer updatedFreelancer) {
            return freelancerRepository.findById(id).map(freelancer -> {
                freelancer.setName(updatedFreelancer.getName());
                freelancer.setEmail(updatedFreelancer.getEmail());
                freelancer.setSkills(updatedFreelancer.getSkills());
                freelancer.setHourlyRate(updatedFreelancer.getHourlyRate());
                freelancer.setBio(updatedFreelancer.getBio());
                freelancer.setProfileUrl(updatedFreelancer.getProfileUrl());
                return freelancerRepository.save(freelancer);
            }).orElse(null);
        }

        public List<Freelancer> searchFreelancersByUsername(String username) {
            return freelancerRepository.findByUsernameLike(username);
        }

        public List<Freelancer> getFreelancersByHourlyRateRange(Double min, Double max) {
            return freelancerRepository.findByHourlyRateBetween(min, max);
        }

        public Freelancer getFreelancerByUserId(Long userId) {
            return freelancerRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Freelancer not found"));
        }

    }
