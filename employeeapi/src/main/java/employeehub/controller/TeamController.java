package employeehub.controller;

import employeehub.domain.Team;
import employeehub.dto.ApiResponse;
import employeehub.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
@Tag(name = "Teams")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    @Operation(summary = "Get all teams, optionally filtered by departmentId")
    public ResponseEntity<ApiResponse<List<Team>>> getAll(@RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(teamService.getAll(departmentId)));
    }

    @PostMapping
    @Operation(summary = "Create a team under a department")
    public ResponseEntity<ApiResponse<Team>> create(@RequestParam Long departmentId, @RequestBody Team team) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(teamService.create(departmentId, team)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a team")
    public ResponseEntity<ApiResponse<Team>> update(@PathVariable Long id, @RequestBody Team team) {
        return ResponseEntity.ok(ApiResponse.ok(teamService.update(id, team)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a team")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Team deleted", null));
    }
}
