import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CurriculoPayload, ProfissionalContext, TemplateId } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: MODERNO (padrão)
// ─────────────────────────────────────────────────────────────────────────────

const mColors = {
  dark: '#0f172a', blue: '#2563eb', body: '#1e293b',
  muted: '#64748b', white: '#ffffff', divider: '#e2e8f0',
  headerSub: '#94a3b8', headerContact: '#cbd5e1',
};

const mStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: mColors.white, fontSize: 9, color: mColors.body },
  header: { backgroundColor: mColors.dark, paddingHorizontal: 40, paddingTop: 30, paddingBottom: 22 },
  headerName: { fontFamily: 'Helvetica-Bold', fontSize: 22, color: mColors.white, letterSpacing: 1, marginBottom: 3 },
  headerTitle: { fontSize: 10, color: mColors.headerSub, marginBottom: 12 },
  headerContactRow: { flexDirection: 'row', flexWrap: 'wrap' },
  headerContactItem: { fontSize: 8, color: mColors.headerContact, marginRight: 18, marginBottom: 2 },
  content: { paddingHorizontal: 40, paddingTop: 22, paddingBottom: 36 },
  section: { marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  sectionAccent: { width: 3, height: 11, backgroundColor: mColors.blue, borderRadius: 2, marginRight: 7 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: mColors.dark, letterSpacing: 1.8, textTransform: 'uppercase' },
  sectionDivider: { height: 0.75, backgroundColor: mColors.divider, marginBottom: 9 },
  summaryText: { fontSize: 9, lineHeight: 1.65, color: mColors.body, textAlign: 'justify' },
  expBlock: { marginBottom: 10 },
  expTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 },
  expCompany: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: mColors.dark },
  expDate: { fontSize: 8, color: mColors.muted, marginTop: 1 },
  expRole: { fontFamily: 'Helvetica-Oblique', fontSize: 8.5, color: mColors.blue, marginBottom: 5 },
  expSeparator: { height: 0.5, backgroundColor: mColors.divider, marginVertical: 8 },
  bulletRow: { flexDirection: 'row', marginBottom: 3, paddingRight: 4 },
  bulletDot: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: mColors.blue, marginRight: 5, marginTop: 1.5 },
  bulletText: { fontSize: 8.5, lineHeight: 1.55, color: mColors.body, flex: 1 },
  projectBlock: { marginBottom: 8 },
  projectTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: mColors.dark, marginBottom: 2 },
  projectDesc: { fontSize: 8.5, lineHeight: 1.55, color: mColors.body, textAlign: 'justify' },
  skillRow: { flexDirection: 'row', marginBottom: 4 },
  skillLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: mColors.dark, width: 88, paddingTop: 1 },
  skillValue: { fontSize: 8, lineHeight: 1.55, color: mColors.body, flex: 1 },
  eduBlock: { marginBottom: 7 },
  eduTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eduTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: mColors.dark },
  eduDate: { fontSize: 8, color: mColors.muted, marginTop: 1 },
  eduInstitution: { fontFamily: 'Helvetica-Oblique', fontSize: 8.5, color: mColors.blue, marginTop: 1 },
});

function MSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={mStyles.section}>
      <View style={mStyles.sectionTitleRow}>
        <View style={mStyles.sectionAccent} />
        <Text style={mStyles.sectionTitle}>{title}</Text>
      </View>
      <View style={mStyles.sectionDivider} />
      {children}
    </View>
  );
}

function MExpBlock({ empresa, bullets, separator = false }: {
  empresa: { nome: string; cargo: string; periodo: string };
  bullets: string[];
  separator?: boolean;
}) {
  return (
    <View wrap={false}>
      {separator && <View style={mStyles.expSeparator} />}
      <View style={mStyles.expBlock}>
        <View style={mStyles.expTopRow}>
          <Text style={mStyles.expCompany}>{empresa.nome}</Text>
          <Text style={mStyles.expDate}>{empresa.periodo}</Text>
        </View>
        <Text style={mStyles.expRole}>{empresa.cargo}</Text>
        {bullets.map((b, i) => (
          <View key={i} style={mStyles.bulletRow}>
            <Text style={mStyles.bulletDot}>▸</Text>
            <Text style={mStyles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildModerno(payload: CurriculoPayload, ctx: ProfissionalContext) {
  return (
    <Document>
      <Page size="A4" style={mStyles.page}>
        <View style={mStyles.header} fixed>
          <Text style={mStyles.headerName}>{ctx.nome}</Text>
          <Text style={mStyles.headerTitle}>{ctx.titulo}</Text>
          <View style={mStyles.headerContactRow}>
            <Text style={mStyles.headerContactItem}>{ctx.email}</Text>
            <Text style={mStyles.headerContactItem}>{ctx.telefone}</Text>
            <Text style={mStyles.headerContactItem}>{ctx.github}</Text>
            <Text style={mStyles.headerContactItem}>{ctx.linkedin}</Text>
            <Text style={mStyles.headerContactItem}>{ctx.localizacao}</Text>
          </View>
        </View>

        <View style={mStyles.content}>
          <MSection title="Resumo Profissional">
            <Text style={mStyles.summaryText}>{payload.resumo}</Text>
          </MSection>

          <MSection title="Experiência Profissional">
            <MExpBlock empresa={ctx.empresas[0]} bullets={payload.exp_frog_bullets} />
            <MExpBlock empresa={ctx.empresas[1]} bullets={payload.exp_brasmid_bullets} separator />
            <MExpBlock empresa={ctx.empresas[2]} bullets={payload.exp_aapvr_bullets} separator />
          </MSection>

          <MSection title="Projetos de Destaque">
            {payload.projetos_destaque.map((p, i) => (
              <View key={i} style={mStyles.projectBlock} wrap={false}>
                <Text style={mStyles.projectTitle}>{p.titulo}</Text>
                <Text style={mStyles.projectDesc}>{p.descricao}</Text>
              </View>
            ))}
          </MSection>

          <MSection title="Habilidades Técnicas">
            <View style={mStyles.skillRow}><Text style={mStyles.skillLabel}>Back-End:</Text><Text style={mStyles.skillValue}>{payload.hab_back}</Text></View>
            <View style={mStyles.skillRow}><Text style={mStyles.skillLabel}>Front-End:</Text><Text style={mStyles.skillValue}>{payload.hab_front}</Text></View>
            <View style={mStyles.skillRow}><Text style={mStyles.skillLabel}>Banco de Dados:</Text><Text style={mStyles.skillValue}>{payload.hab_db}</Text></View>
            <View style={mStyles.skillRow}><Text style={mStyles.skillLabel}>DevOps:</Text><Text style={mStyles.skillValue}>{payload.hab_devops}</Text></View>
            <View style={mStyles.skillRow}><Text style={mStyles.skillLabel}>Arquitetura:</Text><Text style={mStyles.skillValue}>{payload.hab_arq}</Text></View>
            <View style={mStyles.skillRow}><Text style={mStyles.skillLabel}>Segurança:</Text><Text style={mStyles.skillValue}>{payload.hab_seg}</Text></View>
          </MSection>

          <MSection title="Formação Acadêmica">
            {ctx.educacao.map((edu, i) => (
              <View key={i} style={mStyles.eduBlock}>
                <View style={mStyles.eduTopRow}>
                  <Text style={mStyles.eduTitle}>{edu.titulo}</Text>
                  <Text style={mStyles.eduDate}>{edu.periodo}</Text>
                </View>
                <Text style={mStyles.eduInstitution}>{edu.instituicao}</Text>
              </View>
            ))}
          </MSection>
        </View>
      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: MINIMALISTA
// ─────────────────────────────────────────────────────────────────────────────

const minColors = {
  black: '#111111', dark: '#1a1a1a', muted: '#555555',
  light: '#999999', white: '#ffffff', rule: '#cccccc',
};

const minStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: minColors.white, fontSize: 9, color: minColors.dark, paddingHorizontal: 48, paddingTop: 40, paddingBottom: 40 },
  headerName: { fontFamily: 'Helvetica-Bold', fontSize: 20, color: minColors.black, letterSpacing: 0.5, marginBottom: 2 },
  headerTitle: { fontSize: 9.5, color: minColors.muted, marginBottom: 8 },
  headerContactRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  headerContactItem: { fontSize: 8, color: minColors.light, marginRight: 14 },
  rule: { height: 0.5, backgroundColor: minColors.rule, marginBottom: 12 },
  section: { marginBottom: 14 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: minColors.muted, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 },
  summaryText: { fontSize: 9, lineHeight: 1.7, color: minColors.dark, textAlign: 'justify' },
  expBlock: { marginBottom: 10 },
  expTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1 },
  expCompany: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: minColors.black },
  expDate: { fontSize: 8, color: minColors.light },
  expRole: { fontSize: 8.5, color: minColors.muted, marginBottom: 5 },
  expSep: { height: 0.5, backgroundColor: minColors.rule, marginVertical: 8 },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 4 },
  bulletDot: { fontSize: 8.5, color: minColors.muted, marginRight: 6 },
  bulletText: { fontSize: 8.5, lineHeight: 1.55, color: minColors.dark, flex: 1 },
  projectBlock: { marginBottom: 8 },
  projectTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: minColors.black, marginBottom: 2 },
  projectDesc: { fontSize: 8.5, lineHeight: 1.55, color: minColors.dark, textAlign: 'justify' },
  skillRow: { flexDirection: 'row', marginBottom: 3.5 },
  skillLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: minColors.dark, width: 85 },
  skillValue: { fontSize: 8, lineHeight: 1.5, color: minColors.muted, flex: 1 },
  eduBlock: { marginBottom: 7 },
  eduTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eduTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: minColors.black },
  eduDate: { fontSize: 8, color: minColors.light },
  eduInstitution: { fontSize: 8.5, color: minColors.muted, marginTop: 1 },
});

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={minStyles.section}>
      <Text style={minStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MinExpBlock({ empresa, bullets, separator = false }: {
  empresa: { nome: string; cargo: string; periodo: string };
  bullets: string[];
  separator?: boolean;
}) {
  return (
    <View wrap={false}>
      {separator && <View style={minStyles.expSep} />}
      <View style={minStyles.expBlock}>
        <View style={minStyles.expTopRow}>
          <Text style={minStyles.expCompany}>{empresa.nome}</Text>
          <Text style={minStyles.expDate}>{empresa.periodo}</Text>
        </View>
        <Text style={minStyles.expRole}>{empresa.cargo}</Text>
        {bullets.map((b, i) => (
          <View key={i} style={minStyles.bulletRow}>
            <Text style={minStyles.bulletDot}>—</Text>
            <Text style={minStyles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildMinimalista(payload: CurriculoPayload, ctx: ProfissionalContext) {
  return (
    <Document>
      <Page size="A4" style={minStyles.page}>
        <Text style={minStyles.headerName}>{ctx.nome}</Text>
        <Text style={minStyles.headerTitle}>{ctx.titulo}</Text>
        <View style={minStyles.headerContactRow}>
          <Text style={minStyles.headerContactItem}>{ctx.email}</Text>
          <Text style={minStyles.headerContactItem}>{ctx.telefone}</Text>
          <Text style={minStyles.headerContactItem}>{ctx.github}</Text>
          <Text style={minStyles.headerContactItem}>{ctx.linkedin}</Text>
          <Text style={minStyles.headerContactItem}>{ctx.localizacao}</Text>
        </View>
        <View style={minStyles.rule} />

        <MinSection title="Resumo Profissional">
          <Text style={minStyles.summaryText}>{payload.resumo}</Text>
        </MinSection>
        <View style={minStyles.rule} />

        <MinSection title="Experiência Profissional">
          <MinExpBlock empresa={ctx.empresas[0]} bullets={payload.exp_frog_bullets} />
          <MinExpBlock empresa={ctx.empresas[1]} bullets={payload.exp_brasmid_bullets} separator />
          <MinExpBlock empresa={ctx.empresas[2]} bullets={payload.exp_aapvr_bullets} separator />
        </MinSection>
        <View style={minStyles.rule} />

        <MinSection title="Projetos de Destaque">
          {payload.projetos_destaque.map((p, i) => (
            <View key={i} style={minStyles.projectBlock} wrap={false}>
              <Text style={minStyles.projectTitle}>{p.titulo}</Text>
              <Text style={minStyles.projectDesc}>{p.descricao}</Text>
            </View>
          ))}
        </MinSection>
        <View style={minStyles.rule} />

        <MinSection title="Habilidades Técnicas">
          <View style={minStyles.skillRow}><Text style={minStyles.skillLabel}>Back-End</Text><Text style={minStyles.skillValue}>{payload.hab_back}</Text></View>
          <View style={minStyles.skillRow}><Text style={minStyles.skillLabel}>Front-End</Text><Text style={minStyles.skillValue}>{payload.hab_front}</Text></View>
          <View style={minStyles.skillRow}><Text style={minStyles.skillLabel}>Banco de Dados</Text><Text style={minStyles.skillValue}>{payload.hab_db}</Text></View>
          <View style={minStyles.skillRow}><Text style={minStyles.skillLabel}>DevOps</Text><Text style={minStyles.skillValue}>{payload.hab_devops}</Text></View>
          <View style={minStyles.skillRow}><Text style={minStyles.skillLabel}>Arquitetura</Text><Text style={minStyles.skillValue}>{payload.hab_arq}</Text></View>
          <View style={minStyles.skillRow}><Text style={minStyles.skillLabel}>Segurança</Text><Text style={minStyles.skillValue}>{payload.hab_seg}</Text></View>
        </MinSection>
        <View style={minStyles.rule} />

        <MinSection title="Formação Acadêmica">
          {ctx.educacao.map((edu, i) => (
            <View key={i} style={minStyles.eduBlock}>
              <View style={minStyles.eduTopRow}>
                <Text style={minStyles.eduTitle}>{edu.titulo}</Text>
                <Text style={minStyles.eduDate}>{edu.periodo}</Text>
              </View>
              <Text style={minStyles.eduInstitution}>{edu.instituicao}</Text>
            </View>
          ))}
        </MinSection>
      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATES: Record<TemplateId, { label: string; description: string }> = {
  moderno:      { label: 'Moderno',      description: 'Header escuro, acentos azuis. Visual profissional e marcante.' },
  minimalista:  { label: 'Minimalista',  description: 'Clean, sem cores, tipografia pura. Elegante e atemporal.' },
};

export function buildCurriculoDocument(
  payload: CurriculoPayload,
  context: ProfissionalContext,
  template: TemplateId = 'moderno'
) {
  switch (template) {
    case 'minimalista': return buildMinimalista(payload, context);
    default:            return buildModerno(payload, context);
  }
}
