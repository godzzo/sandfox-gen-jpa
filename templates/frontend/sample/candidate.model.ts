import { FuseUtils } from '@fuse/utils';

export class SzemCandidate
{
	id: string;

	KID: string;

	name: string;
	motherName: string;
	birthPlace: string;
	birthDate: string;
	
    codes: any[];
    codeHistories: any[];

    /**
     * Constructor
     *
     * @param candidate
     */
    constructor(candidate?) {
		candidate = candidate || {};
		this.id = candidate.id || FuseUtils.generateGUID();
		
		this.KID = candidate.KID || '';

		this.name = candidate.name || '';
		this.motherName = candidate.motherName || '';
		this.birthPlace = candidate.birthPlace || '';
		this.birthDate = candidate.birthDate || '';
			
		this.codes = candidate.codes || [];
		this.codeHistories = candidate.products || [];
    }
}
