// // Build function and use the D3 library to get samples.json data to biuld plot
function buildPlot(sample) {
    d3.json("samples.json").then((data) => {
        
        // Build plot variable for samples.jason
        var samples = data.samples;

        // Use d3 to   set  location for bar  chart
        var  barLocation = d3.select("#bar");

        // Filter data for object with corresponding sample number
        var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
        var result  = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels
        sample_values=result.sample_values;

        // Build horizontal bar chart
        var yticks = otu_ids.slice(0,10).map(outID => `OTU ${outID}`).reverse();
        var values = sample_values.slice(0,10).reverse();
        var labels = otu_labels.slice(0,10).reverse();

        // Create the horizantal bar trace
        var barData = [{
            y: yticks,
            x: values,
            text: labels,
            type: "bar",
            orientation: "h"

        }];

        var barLayout = {
            title: "Top Ten Bacteria Cultures by Volume",
            margin: {
                l: 100,
                r: 100,
                t: 30
            }
        };

        // Plot horizontal bar chart
        Plotly.newPlot("bar", barData, barLayout, barLocation);

        //  Build the Bubble Chart
        d3.json("samples.json").then((data) => {
            var bubble_loc = d3.select("#bubble")

            // Create bubble chart trace
            var bubbleData = [
                {
                    x: otu_ids,
                    y: sample_values,
                    text: otu_labels,
                    mode: "markers",
                    marker: {
                        size: sample_values,
                        color: otu_ids,
                        colorscale: "Earth",
                        opacity: [1, 0.8, 0.6, 0.4]
                }

            }
        ];
            var bubbleLayout = {
                title: "Samples of Bacteria Cultures",
                margin: {t: 0},
                showlegend: false,
                hovermode: "closest"

            };

            // Plot bubble charts
            Plotly.newPlot("bubble", bubbleData, bubbleLayout, bubble_loc);

        });

    })}
// Display the individual demographic information - sample metadata
// Display key-value pair from metadata json object somewhere  on the page

function buildMetada(sample) {

    // Get metadata from samples.json
    d3.json("samples.json").then((data) => {
        var meta_data = data.metadata;

        // Filter and use d3.select to assign metadata side panell variablle

        var resultArray = meta_data.filter(sampleObject => sampleObject.id == sample);
        var result = resultArray[0];
        var meta_panel = d3.select("#sample-metadata");

        // Clear any existing metadata using `.html("")
        meta_panel.html("");

        // Use Object.enteries to loop through data and append each key-value pair to the metadata panel side
        Object.entries(result).forEach(([key, value]) => {
            meta_panel.append("h5").text(`${key}: ${value}`);

        }
        );
        //  Build Gauge Chart
        // buildgauge(results.wfreq);

        var guageData = [
            {
                domain: { x: [0,1], y: [0,1]},
                value: data.wfreq,
                title: "Belly Button Washing Frequency Scrubs Per week",
                type: "indicator",
                mode: "gauge+number+delta",
                delta: {reference:9, increasing: {color: "green"}},
                gauge: {
                    axis: {range: [0,10]},
                    steps: [
                        {range: [0,5], color: "lightgray"},
                        {range: [5,8], color: "gray"}
                    ],
                    threshold: {
                        line: {color: "red", width: 4},
                        thickness: 0.75,
 },
                       value: 9
                    }
                
            }
        ];

        var guageLayout = {width: 600, height: 450, margin: {t: 0, b:0}};
        Plotly.newPlot("gauge", guageData, guageLayout);
    }
    );
}

// Get reference to dropdown  select element
function init() {
    var dropdownMenu = d3.select("#selDataset");
   

    // Loop through samples.json and add `option`, text and property for sample value  to populate select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        
        sampleNames.forEach((sample) => {
            dropdownMenu
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    // Build default/initial plots using first sample from the list
    defaultSample = sampleNames[0];
    buildPlot(defaultSample);
    buildMetada(defaultSample);

});
}
// Create function for change event

function optionChanged(newSample) {

    // Get new data each time a new sample is selected
    buildPlot(newSample);
    buildMetada(newSample);
}
// Initialize dashboard !!!
init();