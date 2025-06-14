package com.cookfarm.controller;

import com.cookfarm.entity.Ingredient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import com.cookfarm.service.CalendarView;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarView calendarView;

    @Autowired
    public CalendarController(CalendarView calendarView) {
        this.calendarView = calendarView;
    }

    // 1. 특정 날짜에 만료되는 식재료 조회
    @GetMapping("/date")
    public List<Ingredient> getIngredientsByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return calendarView.getIngredientsByDate(date);
    }

    // 2. 유통기한이 지난 식재료 조회
    @GetMapping("/expired")
    public List<Ingredient> getExpiredIngredients() {
        return calendarView.getExpiredIngredients();
    }

    // 3. 전체 유통기한 Map 반환 (달력용)
    @GetMapping("/map")
    public Map<LocalDate, List<Ingredient>> getCalendarMap() {
        return calendarView.getCalendarMap();
    }
}

