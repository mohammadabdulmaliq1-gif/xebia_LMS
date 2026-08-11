package com.xebia.lms.service.analytics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class RedisCacheService {

    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;

    private boolean isRedisAvailable = true;

    public String get(String key) {
        if (redisTemplate == null || !isRedisAvailable) {
            return null;
        }
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Redis is unavailable, falling back. Error: " + e.getMessage());
            isRedisAvailable = false;
            return null;
        }
    }

    public void put(String key, String value, long ttlSeconds) {
        if (redisTemplate == null || !isRedisAvailable) {
            return;
        }
        try {
            redisTemplate.opsForValue().set(key, value, ttlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            System.err.println("Redis is unavailable for writing. Error: " + e.getMessage());
            isRedisAvailable = false;
        }
    }

    public void invalidateAll() {
        if (redisTemplate == null || !isRedisAvailable) {
            return;
        }
        try {
            Set<String> keys = redisTemplate.keys("analytics:*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception e) {
            System.err.println("Redis is unavailable for clearing cache. Error: " + e.getMessage());
            isRedisAvailable = false;
        }
    }

    public void resetConnection() {
        isRedisAvailable = true;
    }
}
