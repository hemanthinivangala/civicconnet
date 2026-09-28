import { GoogleGenAI } from '@google/genai';
import { ComplaintCategory, Service, Ward, MunicipalOffice, GarbageSchedule } from '../types';

export interface CategorySuggestion {
  category: ComplaintCategory;
  issueType: string;
  confidence: number;
  reason: string;
}

// Keyword-based fallback engine - guarantees instant, offline-capable, and reliable categorization
export function categorizeComplaintKeywords(text: string): CategorySuggestion {
  const lower = text.toLowerCase();

  // Garbage / Waste
  if (
    lower.includes('garbage') ||
    lower.includes('trash') ||
    lower.includes('dump') ||
    lower.includes('waste') ||
    lower.includes('refuse') ||
    lower.includes('bin') ||
    lower.includes('rubble') ||
    lower.includes('debris') ||
    lower.includes('litter')
  ) {
    if (lower.includes('not collected') || lower.includes('missed') || lower.includes('three days') || lower.includes('uncollected')) {
      return {
        category: 'GARBAGE',
        issueType: 'Missed Collection',
        confidence: 0.95,
        reason: 'Detected keywords regarding uncollected garbage or missed scheduled pickup.',
      };
    }
    if (lower.includes('illegal') || lower.includes('dumping') || lower.includes('rubble')) {
      return {
        category: 'GARBAGE',
        issueType: 'Illegal Dumping',
        confidence: 0.92,
        reason: 'Detected references to unauthorized dumping or construction debris.',
      };
    }
    return {
      category: 'GARBAGE',
      issueType: 'Waste Accumulation',
      confidence: 0.88,
      reason: 'Detected solid waste management terms.',
    };
  }

  // Roads / Potholes
  if (
    lower.includes('pothole') ||
    lower.includes('road') ||
    lower.includes('asphalt') ||
    lower.includes('crater') ||
    lower.includes('speed bump') ||
    lower.includes('pavement') ||
    lower.includes('subsidence') ||
    lower.includes('tar') ||
    lower.includes('street damage')
  ) {
    return {
      category: 'ROADS_POTHOLES',
      issueType: lower.includes('pothole') ? 'Pothole' : 'Road Surface Damage',
      confidence: 0.95,
      reason: 'Detected roadway or pothole pavement defect description.',
    };
  }

  // Streetlight / Lighting
  if (
    lower.includes('streetlight') ||
    lower.includes('street light') ||
    lower.includes('lamp') ||
    lower.includes('dark') ||
    lower.includes('bulb') ||
    lower.includes('pole light') ||
    lower.includes('flicker') ||
    lower.includes('illumination')
  ) {
    return {
      category: 'STREETLIGHT',
      issueType: 'Non-functional Light',
      confidence: 0.94,
      reason: 'Detected public street lighting malfunction keywords.',
    };
  }

  // Water supply
  if (
    lower.includes('water supply') ||
    lower.includes('drinking water') ||
    lower.includes('pipeline') ||
    lower.includes('pipe burst') ||
    lower.includes('pipe leak') ||
    lower.includes('low pressure') ||
    lower.includes('tap') ||
    lower.includes('turbid water') ||
    lower.includes('brown water')
  ) {
    return {
      category: 'WATER',
      issueType: lower.includes('burst') || lower.includes('leak') ? 'Pipeline Leak' : 'Low Water Pressure',
      confidence: 0.92,
      reason: 'Detected municipal drinking water pipeline or pressure keywords.',
    };
  }

  // Drainage / Stormwater
  if (
    lower.includes('drain') ||
    lower.includes('drainage') ||
    lower.includes('gutter') ||
    lower.includes('manhole') ||
    lower.includes('stormwater') ||
    lower.includes('waterlogging') ||
    lower.includes('flooding street') ||
    lower.includes('clogged culvert')
  ) {
    return {
      category: 'DRAINAGE',
      issueType: lower.includes('manhole') ? 'Missing Manhole Cover' : 'Drain Blockage',
      confidence: 0.93,
      reason: 'Detected stormwater drainage or manhole maintenance keywords.',
    };
  }

  // Sanitation / Public Restroom / Sewage
  if (
    lower.includes('toilet') ||
    lower.includes('restroom') ||
    lower.includes('sewage') ||
    lower.includes('stench') ||
    lower.includes('foul smell') ||
    lower.includes('sanitation') ||
    lower.includes('urinal')
  ) {
    return {
      category: 'SANITATION',
      issueType: lower.includes('toilet') || lower.includes('restroom') ? 'Toilet Sanitation' : 'Sewage Stagnation',
      confidence: 0.91,
      reason: 'Detected public sanitation or sewage overflow keywords.',
    };
  }

  // Trees / Horticulture
  if (
    lower.includes('tree') ||
    lower.includes('branch') ||
    lower.includes('sapling') ||
    lower.includes('pruning') ||
    lower.includes('fallen tree') ||
    lower.includes('bough') ||
    lower.includes('roots')
  ) {
    return {
      category: 'TREES',
      issueType: 'Hazardous Tree Branch',
      confidence: 0.93,
      reason: 'Detected municipal arboriculture and tree hazard keywords.',
    };
  }

  // Public Infrastructure
  if (
    lower.includes('park') ||
    lower.includes('bench') ||
    lower.includes('sidewalk') ||
    lower.includes('footpath') ||
    lower.includes('traffic signal') ||
    lower.includes('bus stop') ||
    lower.includes('railing') ||
    lower.includes('playground') ||
    lower.includes('swing')
  ) {
    return {
      category: 'PUBLIC_INFRASTRUCTURE',
      issueType: 'Infrastructure Repair',
      confidence: 0.88,
      reason: 'Detected public street furniture or facility keywords.',
    };
  }

  return {
    category: 'OTHER',
    issueType: 'General Civic Grievance',
    confidence: 0.6,
    reason: 'General civic request. Please review the category if needed.',
  };
}

export async function categorizeComplaintWithAI(title: string, description: string): Promise<CategorySuggestion> {
  const combined = `${title} ${description}`.trim();
  if (!combined) {
    return {
      category: 'OTHER',
      issueType: 'General Civic Grievance',
      confidence: 0.5,
      reason: 'Please enter details for automatic category suggestion.',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return robust instant keyword categorization
    return categorizeComplaintKeywords(combined);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this citizen municipal problem report:
Title: "${title}"
Description: "${description}"

Categories:
- GARBAGE (uncollected waste, bins, trash, illegal dumping)
- STREETLIGHT (broken lamps, dark streets, loose wiring)
- ROADS_POTHOLES (potholes, asphalt damage, road depressions)
- WATER (pipe burst, water leaks, low pressure, discolored water)
- DRAINAGE (clogged storm drains, street gutters, open manholes)
- SANITATION (public restrooms, sewage stagnation, odors)
- TREES (fallen tree branches, roots, tree pruning)
- PUBLIC_INFRASTRUCTURE (broken benches, playground, bus stops, signals, sidewalks)
- OTHER (general grievances)

Output STRICT JSON only:
{"category":"...","issueType":"...","confidence":0.95,"reason":"..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.category) {
      return {
        category: parsed.category as ComplaintCategory,
        issueType: parsed.issueType || 'Civic Issue',
        confidence: parsed.confidence || 0.9,
        reason: parsed.reason || 'AI categorized from problem description.',
      };
    }
  } catch (err) {
    console.warn('AI categorization failed, falling back to rule-based parser:', err);
  }

  return categorizeComplaintKeywords(combined);
}

// n8n AI Agent Webhook Endpoint
export const N8N_WEBHOOK_CHAT_URL =
  'https://hemanthinivangala.app.n8n.cloud/webhook/e84bc967-5dc7-4e3f-acbf-dcfa8bbff6c8/chat';

// CivicAssist Engine
export interface CivicAssistContext {
  services: Service[];
  wards: Ward[];
  offices: MunicipalOffice[];
  schedules: GarbageSchedule[];
}

export async function sendKnowledgeToN8n(context: CivicAssistContext): Promise<{ success: boolean; message: string }> {
  try {
    const payload = {
      event: 'MUNICIPAL_DATA_SYNC',
      timestamp: new Date().toISOString(),
      departments: context.services.map((s) => ({ id: s.id, name: s.name, dept: s.departmentName })),
      wards: context.wards.map((w) => ({ number: w.number, name: w.name, zone: w.zone, councillor: w.councillorName })),
      services: context.services.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        description: s.description,
        requiredDocuments: s.requiredDocuments,
        steps: s.applicationSteps,
        department: s.departmentName,
      })),
      offices: context.offices.map((o) => ({
        name: o.name,
        address: o.address,
        phone: o.phone,
        workingHours: o.workingHours,
        services: o.servicesAvailable,
      })),
      schedules: context.schedules.map((sc) => ({
        ward: sc.wardName,
        locality: sc.localityName,
        days: sc.collectionDays,
        time: sc.timeSlot,
        vehicle: sc.vehicleNumber,
      })),
    };

    const res = await fetch(N8N_WEBHOOK_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return { success: true, message: 'Municipal dataset successfully transmitted to your n8n AI Agent webhook!' };
    } else {
      return { success: false, message: `n8n webhook responded with status ${res.status}` };
    }
  } catch (err: any) {
    return { success: false, message: `Failed to reach n8n webhook: ${err.message}` };
  }
}

export async function askCivicAssist(
  userQuery: string,
  context: CivicAssistContext
): Promise<{ text: string; source?: 'n8n' | 'gemini' | 'local'; quickActions?: { label: string; action: string }[] }> {
  const q = userQuery.toLowerCase().trim();

  // Guardrail check: Disclaim any fee/law invention
  const disclaimerNote = '\n\n*Note: Official statutory fees, legal deadlines, and regulatory policies must be verified directly with the municipal registrar or official municipal portal.*';

  // 1. Try Live n8n AI Agent Webhook first!
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const n8nResponse = await fetch(N8N_WEBHOOK_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify({
        chatInput: userQuery,
        message: userQuery,
        query: userQuery,
        sessionId: 'civicconnect-user-session',
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (n8nResponse.ok) {
      const contentType = n8nResponse.headers.get('content-type') || '';
      let replyText = '';

      if (contentType.includes('application/json')) {
        const data = await n8nResponse.json();
        // Support common n8n AI agent response shapes: { output: ... }, { text: ... }, { message: ... }, { response: ... }, or array [{ output: ... }]
        if (typeof data === 'string') {
          replyText = data;
        } else if (Array.isArray(data) && data.length > 0) {
          replyText = data[0].output || data[0].text || data[0].message || data[0].response || JSON.stringify(data[0]);
        } else if (typeof data === 'object' && data !== null) {
          replyText = data.output || data.text || data.message || data.response || data.result || '';
          if (!replyText && data.answer) replyText = data.answer;
          if (!replyText) replyText = JSON.stringify(data);
        }
      } else {
        replyText = await n8nResponse.text();
      }

      if (replyText && replyText.trim()) {
        return {
          text: replyText.trim() + disclaimerNote,
          source: 'n8n',
          quickActions: [
            { label: 'Report a Problem', action: 'report' },
            { label: 'Find a Service', action: 'services' },
            { label: 'Track Complaint', action: 'track' },
            { label: 'Find Office', action: 'offices' },
            { label: 'Garbage Schedule', action: 'garbage' },
          ],
        };
      }
    }
  } catch (n8nErr) {
    console.info('n8n webhook query bypassed or unavailable, using municipal knowledge base:', n8nErr);
  }

  // 2. Birth certificate inquiries
  if (q.includes('birth certificate') || q.includes('birth cert')) {
    const srv = context.services.find((s) => s.id === 'srv-3');
    return {
      text: `To apply for a **Birth Certificate** in CivicConnect:

**Required Documents:**
${srv?.requiredDocuments.map((d) => `• ${d}`).join('\n')}

**Application Steps:**
1. Fill child's full name, exact date and location of birth.
2. Upload verified hospital discharge or birth notification along with parents' valid IDs.
3. Submit online through the Municipal Civil Registry counter.
4. Estimated processing: ${srv?.processingTime || '3-5 business days'}.

You can start your request directly from the Municipal Services catalog.${disclaimerNote}`,
      quickActions: [
        { label: 'View Birth Certificate Service', action: 'services:srv-3' },
        { label: 'Find Civil Registry Office', action: 'offices' },
        { label: 'Report a Problem', action: 'report' },
      ],
    };
  }

  // 2. Pothole / Road damage inquiries
  if (q.includes('pothole') || q.includes('road repair') || q.includes('damaged road')) {
    return {
      text: `To report a **Pothole or Road Surface Damage**:

1. Click **"Report a Problem"** in the top navigation.
2. Type a brief title (e.g., *"Deep pothole on Federal Avenue"*).
3. CivicConnect will automatically detect the **Roads/Potholes** category.
4. Select your **Ward** and **Locality**, or click on the interactive OpenStreetMap to place an exact pin.
5. Take or upload a quick photo showing the depth of the pothole.
6. Submit to instantly receive your tracking ID (e.g., \`CC-2026-000001\`).

Public Works & Roads maintenance teams typically inspect arterial road reports within 24 to 48 hours.`,
      quickActions: [
        { label: 'Report a Pothole Now', action: 'report' },
        { label: 'Track Existing Complaint', action: 'track' },
        { label: 'View Active Road Projects', action: 'projects' },
      ],
    };
  }

  // 3. Garbage collection / Waste schedule inquiries
  if (q.includes('garbage') || q.includes('trash') || q.includes('waste collection') || q.includes('when is garbage')) {
    let wardInfoText = '';
    const foundWard = context.wards.find((w) => q.includes(w.name.toLowerCase()) || q.includes(`ward ${w.number}`));
    if (foundWard) {
      const schedules = context.schedules.filter((s) => s.wardId === foundWard.id);
      wardInfoText = `\n\n**Schedules for ${foundWard.name}:**\n` +
        schedules
          .map((s) => `• **${s.localityName}**: ${s.collectionDays.join(', ')} (${s.timeSlot}) - Vehicle: ${s.vehicleNumber}`)
          .join('\n');
    }

    return {
      text: `Municipal **Garbage Collection** operates daily between **6:00 AM and 9:30 AM** across all municipal wards.

**Collection Segregation Guidelines:**
• **Green Bin (Wet Waste):** Kitchen scraps, fruit peels, vegetable waste, organic leaves.
• **Blue Bin (Dry Waste):** Clean cardboard, paper, aluminum cans, plastic packaging.
• **Hazardous / E-Waste:** Batteries, chemicals, medical waste (drop off at Ward Offices).${wardInfoText}

If a garbage truck missed your street or you have bulk furniture to discard, use the Garbage Management portal.${disclaimerNote}`,
      quickActions: [
        { label: 'View Garbage Schedules', action: 'garbage' },
        { label: 'Report Missed Collection', action: 'garbage' },
        { label: 'Request Bulk Pickup', action: 'garbage' },
      ],
    };
  }

  // 4. Municipal Office inquiries
  if (q.includes('office') || q.includes('city hall') || q.includes('where is') || q.includes('working hours')) {
    const mainOffice = context.offices[0];
    return {
      text: `**Municipal Corporation Central Headquarters & Ward Offices:**

• **Main Headquarters:** ${mainOffice.name}
• **Address:** ${mainOffice.address}
• **Phone:** ${mainOffice.phone}
• **Public Working Hours:** ${mainOffice.workingHours}

There are **4 zonal administrative offices** located across East, West, North, and Central districts for local citizen services including birth/death registration, property tax clearance, and civil grievances.`,
      quickActions: [
        { label: 'View All Municipal Offices & Map', action: 'offices' },
        { label: 'Find My Ward Office', action: 'ward' },
        { label: 'Contact Municipality', action: 'offices' },
      ],
    };
  }

  // 5. Document requirements general
  if (q.includes('document') || q.includes('documents required') || q.includes('requirements')) {
    return {
      text: `Document requirements vary by municipal service:

• **Property Tax:** Parcel Assessment Number (PAN) or title deed, Government Photo ID.
• **Water Connection:** Consumer Account Number, ownership deed or tenant agreement.
• **Birth / Death Certificates:** Hospital discharge notice, parents' or deceased's IDs.
• **Trade License:** Premise lease, commercial fire NOC, business tax registration.
• **Building Permission:** Registered architectural CAD blueprints, structural stability certificate.

You can browse our complete **Municipal Services** catalog to view verified checklists for all 15 civic services.${disclaimerNote}`,
      quickActions: [
        { label: 'Browse Municipal Services', action: 'services' },
        { label: 'Report a Civic Problem', action: 'report' },
      ],
    };
  }

  // 6. Gemini-powered dynamic fallback if API key configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are CivicAssist, the official AI Municipal Assistant for CivicConnect.
Citizen Query: "${userQuery}"

Strict Municipal Rules:
1. Provide accurate, professional, courteous civic assistance.
2. Must NOT invent real government statutory fees, legislation, taxes, penalties, or official legal deadlines.
3. If specific fee or legal information is requested, instruct citizen to verify with the Municipal Office or relevant department.
4. Ground responses in standard municipal civic categories: Complaints (roads, streetlights, garbage, water, drainage), Ward info, Waste schedules, and Municipal offices.

Write a clean markdown response:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return {
        text: (response.text || '') + disclaimerNote,
        quickActions: [
          { label: 'Report a Problem', action: 'report' },
          { label: 'Find a Service', action: 'services' },
          { label: 'Track Complaint', action: 'track' },
          { label: 'Find Office', action: 'offices' },
          { label: 'Garbage Schedule', action: 'garbage' },
        ],
      };
    } catch (err) {
      console.warn('Gemini CivicAssist query error, using fallback:', err);
    }
  }

  // Default helpful municipal fallback
  return {
    text: `Hello! I am **CivicAssist**, your municipal digital assistant.

I can help you with:
• **Reporting Civic Problems:** Potholes, broken streetlights, water pipeline leaks, uncollected garbage, or drainage overflows.
• **Tracking Status:** Check real-time progress on your complaint ID (e.g., \`CC-2026-000001\`).
• **Municipal Services:** Information on Property Tax, Water Bills, Birth/Death certificates, Trade Licenses, and Building Sanctions.
• **Ward Details:** Local councillor contacts, facilities, and active public projects.
• **Garbage Schedules:** Route timings, segregation guides, and missed collection reporting.

How can I assist your neighborhood today?${disclaimerNote}`,
    quickActions: [
      { label: 'Report a Problem', action: 'report' },
      { label: 'Find a Service', action: 'services' },
      { label: 'Track Complaint', action: 'track' },
      { label: 'Find Office', action: 'offices' },
      { label: 'Garbage Schedule', action: 'garbage' },
    ],
  };
}
