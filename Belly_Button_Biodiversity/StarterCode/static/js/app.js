//Use the D3 library to read in `samples.json`.
function buildPlot(sample) {
    d3.json("samples.json").then((data) => {
        
// Build plot variable for samples.jason
        var samples = data.samples;

// Filter data for object with corresponding sample number
        var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
        var result  = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels
        sample_values=result.sample_values;

// Use d3 to   set  location for bar  chart
var  barLocation = d3.select("#bar");

// Build horizontal bar chart
        var yticks = otu_ids.slice(0,10).map(outID => `OTU ${outID}`).reverse();
        var values = sample_values.slice(0,10).reverse();
        var labels = otu_labels.slice(0,10).reverse();


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

 
        Plotly.newPlot("bar", barData, barLayout, barLocation);

//  Build the Bubble Chart
        d3.json("samples.json").then((data) => {
            var bubble_loc = d3.select("#bubble")


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
 
//Display the sample metadata, i.e., an individual's demographic information.

function buildMetada(sample) {

 
    d3.json("samples.json").then((data) => {
        var meta_data = data.metadata;

 

        var resultArray = meta_data.filter(sampleObject => sampleObject.id == sample);
        var result = resultArray[0];
        var meta_panel = d3.select("#sample-metadata");
        meta_panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            meta_panel.append("h5").text(`${key}: ${value}`);

        }
        );

    }
    );
}

 
function init() {
    var dropdownMenu = d3.select("#selDataset");
   

 
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        
        sampleNames.forEach((sample) => {
            dropdownMenu
            .append("option")
            .text(sample)
            .property("value", sample);
    });

 
    defaultSample = sampleNames[0];
    buildPlot(defaultSample);
    buildMetada(defaultSample);

});
}
 

function optionChanged(newSample) {

 
    buildPlot(newSample);
    buildMetada(newSample);
}
 
init();