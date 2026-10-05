package com.rtps.platform.entity.enums;

public enum SkillLevel {
    BEGINNER(1, 25),
    INTERMEDIATE(2, 50),
    ADVANCED(3, 75),
    EXPERT(4, 100);

    private final int rank;
    private final int defaultProficiency;

    SkillLevel(int rank, int defaultProficiency) {
        this.rank = rank;
        this.defaultProficiency = defaultProficiency;
    }

    public int getRank() {
        return rank;
    }

    public int getDefaultProficiency() {
        return defaultProficiency;
    }

    public boolean meetsOrExceeds(SkillLevel required) {
        if (required == null) return true;
        return this.rank >= required.rank;
    }
}
