function skillsMember() {
    return {
        skills: ['React', 'Angular', 'Vue', 'Node', 'Express', 'Mongo', 'Postgres'],
        getSkills: function() {
            return this.skills;
        }
    }
}