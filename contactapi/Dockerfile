# ---------------------------------------------------------------------- #
# Stage 1: Build
# ---------------------------------------------------------------------- #

FROM maven:3.9-eclipse-temurin-25 AS builder

WORKDIR app

# Copy Maven Config Files:

COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn/ .mvn/

# Copy Source:

COPY src src

# Build the Application:l

RUN mvn clean package -DskipTests

# ---------------------------------------------------------------------- #
# Stage 1: Build
# ---------------------------------------------------------------------- #

FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# Photo's Directory for Contact Pictures:

RUN mkdir -p /app/photos

EXPOSE 8080

# Health-Check:
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
                CMD wget --quiet --tries=1 --spider http://localhost:8080/contacts || exit 1

# Run Application:

ENTRYPOINT ["java", "-jar", "app.jar"]
