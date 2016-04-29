var AJAXQueue = {
    requests: {},
    ajax_url: AJAXQueueData.ajax_url,
    action: AJAXQueueData.action
};

(function ($, queue) {
    'use strict';

    /*
     * Adds an AJAX call to the queue.
     *
     * action:   The action used in the WP AJAX API (ie: wp_ajax_{action})
     * opts:     POST data sent to the AJAX handler
     * callback: Function that will be called when the AJAX call is completed. Will pass
     *           the response from the server for this particular action as parameter.
     *
     * Samples:
     *
     * JAXQueue.add('some_ajax_call', {some:'param'}, function(response){ console.log(response); });
     * JAXQueue.add('some_other_call', {user:'me'}, function(response){ console.log(response); });
     *
     */
    queue.add = function (action, opts, callback) {
        queue.requests[queue.get_random_key()] = {
            action: action,
            opts: opts,
            callback: callback
        };
    };

    /*
     * Executes a single AJAX call for all the calls added to the queue.
     * Unless you pass keep=true the queue will be emptied.
     */
    queue.run = function (keep) {
        if (queue.is_empty()) {
            return;
        }

        // We need a copy of queue.requests without the callbacks
        // as it turns out that $.post will execute those callbacks if we pass them
        var data = {};
        Object.keys(queue.requests).forEach(function (key) {
            data[key] = {
                action: queue.requests[key].action,
                opts: queue.requests[key].opts
            };
        });

        var opts = {
            action: queue.action,
            requests: data
        };

        $.post(queue.ajax_url, opts, function (response) {

            if (!response.success) {
                return;
            }

            Object.keys(response.data).forEach(function (key) {
                queue.requests[key].callback(response.data[key]);
            });

            if (! keep) {
                queue.clean();
            }
        });


    };

    /*
     * Clears the queue
     */
    queue.clean = function () {
        queue.requests = {}
    };

    /*
     * Generates a random string that will be used so
     * multiple calls to the same action can be performed
     */
    queue.get_random_key = function () {
        return Math.random().toString(36).substr(2);
    };

    /*
     * Returns true if the queue is empty, false otherwise.
     */
    queue.is_empty = function () {
        return Object.keys(AJAXQueue.requests).length == 0;
    }

})(jQuery, AJAXQueue);
