
import gsjson = require('google-spreadsheet-to-json');

export async function LoadSpreadsheetData(spreadsheetId: string, credentials: string) {
	return gsjson({
		spreadsheetId: spreadsheetId,
		credentials: credentials,
		// worksheet: [0, 1, 2]
		allWorksheets: true,
	});
}
