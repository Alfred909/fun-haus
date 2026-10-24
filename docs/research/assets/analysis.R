# Beyond the Building — prepared workbook data and Leaflet
# Personal research project; starter code, not executed here.
# Install as needed: install.packages(c("readr", "dplyr", "leaflet", "htmltools", "shiny"))
library(readr)
library(dplyr)
library(leaflet)
library(htmltools)

# Download events.csv and map-venues.csv into your R working directory.
events <- read_csv("events.csv", show_col_types = FALSE)
venues <- read_csv("map-venues.csv", show_col_types = FALSE)
selected_year <- 2025

make_map <- function(selected_year) {
  points <- events |>
    filter(Year == selected_year) |>
    left_join(venues, by = "Venue_ID") |>
    filter(!is.na(Latitude), !is.na(Longitude))
  # Escape workbook text before including it in popup HTML.
  points$popup <- paste0(
    "<strong>", htmlEscape(points$Event_Name), "</strong><br>",
    points$Year, " · ", htmlEscape(points$Original_Venue), "<br>",
    htmlEscape(points$Description), "<br>",
    "<a target='_blank' rel='noopener' href='", htmlEscape(points$Source_URL, attribute = TRUE),
    "'>Evidence source</a><br><small>Approximate geocoded location</small>"
  )
  leaflet(points) |>
    addTiles() |>
    addCircleMarkers(lng = ~Longitude, lat = ~Latitude,
                     radius = 7, color = "#377975",
                     label = ~Event_Name, popup = ~popup) |>
    setView(lng = -122.335, lat = 47.6106, zoom = 15)
}
make_map(selected_year)

# Optional Shiny app. Overlapping events share coordinates; the website groups
# them by venue. For R, consider one venue popup listing its event occurrences.
if (interactive() && requireNamespace("shiny", quietly = TRUE)) {
  library(shiny)
  ui <- fluidPage(
    titlePanel("Beyond the Building — PAX ecosystem"),
    selectInput("year", "Documented year", choices = sort(unique(events$Year)), selected = 2025),
    leafletOutput("event_map", height = 600),
    p("Minimum documented coverage. Missing records do not establish absence of activity.")
  )
  server <- function(input, output, session) {
    output$event_map <- renderLeaflet(make_map(as.integer(input$year)))
  }
  shinyApp(ui, server)
}
