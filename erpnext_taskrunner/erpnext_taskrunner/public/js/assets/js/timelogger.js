import useBackendHandler from './script.js';
import useTask from './task.js';

export default function useTimeLogger(props, emit, description, startTime, stopTime, docText) {
    const { callBackendHandler } = useBackendHandler();
    const { updateTimesheetDetail } = useTask(null, null, null, null, null);

    const formatDateTime = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    const logTime = async () => {
        if (!props.descriptionOnly) {
            if (!startTime.value || !stopTime.value) {
                alert('Both start time and stop time are required!');
                return;
            }

            // call the backend handler to log the time
            try {
                const r = await callBackendHandler('log_time', {
                    project: props.doc.project,
                    docName: props.doc.docName,
                    startTime: startTime.value,
                    stopTime: stopTime.value,
                    description: description.value || ''
                }, null);

                frappe.show_alert({
                    message: __(`Time logged for ${docText.value}`),
                    indicator: 'green'
                });
                
            }
            catch (error) {
                emit('catch-error', error)
            }
        }
        closeSidebar(); // Close sidebar after logging time
    };

    const closeSidebar = () => {
        if (props.descriptionOnly) {
            updateTimesheetDetail(props.doc.project, props.doc.docName, 'stopped', props.doc.timesheetDetail, description.value || '');
        }
        emit('close-time-logger');
    };

    return {
        formatDateTime,
        logTime,
        closeSidebar
    }
}
