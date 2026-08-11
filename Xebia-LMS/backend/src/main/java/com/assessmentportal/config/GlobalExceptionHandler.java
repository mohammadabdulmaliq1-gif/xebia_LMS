package com.assessmentportal.config;

import com.mongodb.MongoTimeoutException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MongoTimeoutException.class)
    public ResponseEntity<Object> handleMongoTimeoutException(MongoTimeoutException ex, WebRequest request) {
        log.error("MongoDB Timeout Exception", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Database connection timeout", ex, request);
    }

    @ExceptionHandler(DataAccessResourceFailureException.class)
    public ResponseEntity<Object> handleDataAccessResourceFailureException(DataAccessResourceFailureException ex, WebRequest request) {
        log.error("Data Access Resource Failure", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Database resource failure", ex, request);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Object> handleNullPointerException(NullPointerException ex, WebRequest request) {
        log.error("Null Pointer Exception", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Null Pointer Exception encountered", ex, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        log.error("Unhandled exception caught", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex, request);
    }

    private ResponseEntity<Object> buildErrorResponse(HttpStatus status, String message, Exception ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message + ": " + ex.getMessage());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(body, status);
    }
}
