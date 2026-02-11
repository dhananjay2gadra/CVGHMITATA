

function checkVehicle() {
    $.ajax({
        url: 'data/GetDeviceSession',
        method: 'GET',
        success: function (data) {
            //const items = document.querySelectorAll('.sp_item');


            //items.forEach(item => {
            //    item.style.color = '#fd5c63';
            //});
            setAllNodesStop();

            data.forEach(vehicle => {

                //var plateNo;
                if (vehicle.attributes.device != null) {
                    console.log(vehicle.attributes.device.mobileNo);
                    changeNodeColor(vehicle.attributes.device.mobileNo, 'node-highlight');
                  //plateNo = vehicle.attributes.device.plateNo;
                }




            });
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
}

function setAllNodesStop() {
    let tree = $('#my_tree').jstree(true);

    // Get all nodes (flat list)
    let allNodes = tree.get_json('#', { flat: true });

    allNodes.forEach(n => {
        if (n.type === "child") {

            let node = tree.get_node(n.id);

            node.li_attr.class = (node.li_attr.class || "")
                .replace(/\bnode-(stop|highlight)\b/g, '')
                .trim();

            node.li_attr.class += " node-stop";

            tree.redraw_node(node.id);
        }
    });
}


function changeNodeColor(nodeId, cssClass) {
    try {
        let tree = $('#my_tree').jstree(true);
        let node = tree.get_node(nodeId);

        if (!node) {
            console.warn("Node not found:", nodeId);
            return;
        }

        // Remove previous color classes
        node.li_attr.class = (node.li_attr.class || "")
            .replace(/\bnode-(highlight|stop)\b/g, '')
            .trim();

        // Add new class
        node.li_attr.class += " " + cssClass;

        // Redraw node
        tree.redraw_node(nodeId);
    } catch (error) {
        console.log(error.message);
    }
}


//setTimeout(function () {
//    changeNodeColor('791078963128', 'node-highlight');
//}, 5000);


setInterval(() => {
    checkVehicle();
}, 10000); // 1000 ms = 1 second


    document.getElementById('fileUpload').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    // Validate JPG/JPEG
    if (!file.type.includes('jpeg')) {
        alert('Only JPG / JPEG images are allowed');
    this.value = '';
    document.getElementById('previewImg').src = '/images/noimage.png';
    return;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('previewImg').src = e.target.result;
    };
    reader.readAsDataURL(file);
});

