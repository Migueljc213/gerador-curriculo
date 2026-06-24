import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CurriculoPayload, ProfissionalContext, TemplateId } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE: CLÁSSICO (baseado no novo layout .docx)
// Header 2 colunas · Títulos com borda cinza superior · Tipografia preta pura
// ─────────────────────────────────────────────────────────────────────────────

const cColors = {
  name:    '#262626',
  section: '#262626',
  body:    '#111111',
  muted:   '#595959',
  rule:    '#A6A6A6',
  white:   '#ffffff',
};

const cStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: cColors.white,
    fontSize: 10,
    color: cColors.body,
    paddingHorizontal: 72,
    paddingTop: 45,
    paddingBottom: 54,
  },

  // Header
  header: { flexDirection: 'row', marginBottom: 14 },
  headerLeft: { flex: 6 },
  headerRight: { flex: 4, alignItems: 'flex-end', paddingTop: 4 },
  headerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 28,
    color: cColors.name,
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  headerTitle: { fontSize: 10, color: cColors.muted },
  headerContact: { fontSize: 8.5, color: cColors.muted, marginBottom: 1.5, textAlign: 'right' },

  // Section
  section: { marginBottom: 12 },
  sectionHeader: {
    borderTopWidth: 0.75,
    borderTopColor: cColors.rule,
    paddingTop: 5,
    marginBottom: 7,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: cColors.section,
    letterSpacing: 0.2,
  },

  // Experience
  expBlock: { marginBottom: 9 },
  expDate: { fontSize: 8.5, color: cColors.muted, marginBottom: 1 },
  expRole: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: cColors.body,
    marginBottom: 4,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5, paddingRight: 4 },
  bulletDot: { fontSize: 9, color: cColors.body, marginRight: 5, marginTop: 0.5 },
  bulletText: { fontSize: 9, lineHeight: 1.55, color: cColors.body, flex: 1 },
  expSep: { height: 0.5, backgroundColor: '#e0e0e0', marginVertical: 7 },

  // Skills
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: cColors.body,
    width: 120,
  },
  skillValue: { fontSize: 9, lineHeight: 1.5, color: cColors.body, flex: 1 },

  // Education
  eduBlock: { marginBottom: 8 },
  eduTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: cColors.body, marginBottom: 1 },
  eduInstitution: { fontSize: 9, color: cColors.muted, marginBottom: 1 },
  eduPeriod: { fontSize: 8.5, color: cColors.muted },

  // Projects
  projectBlock: { marginBottom: 8 },
  projectTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: cColors.body, marginBottom: 2 },
  projectDesc: { fontSize: 9, lineHeight: 1.55, color: cColors.body, textAlign: 'justify' },

  // Summary
  summaryText: { fontSize: 10, lineHeight: 1.65, color: cColors.body, textAlign: 'justify' },
});

function CSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={cStyles.section}>
      <View style={cStyles.sectionHeader}>
        <Text style={cStyles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function CExpBlock({ empresa, bullets, separator = false }: {
  empresa: { nome: string; cargo: string; periodo: string };
  bullets: string[];
  separator?: boolean;
}) {
  return (
    <View wrap={false}>
      {separator && <View style={cStyles.expSep} />}
      <View style={cStyles.expBlock}>
        <Text style={cStyles.expDate}>{empresa.periodo}</Text>
        <Text style={cStyles.expRole}>{empresa.cargo} | {empresa.nome}</Text>
        {bullets.map((b, i) => (
          <View key={i} style={cStyles.bulletRow}>
            <Text style={cStyles.bulletDot}>•</Text>
            <Text style={cStyles.bulletText}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function buildClassico(payload: CurriculoPayload, ctx: ProfissionalContext) {
  return (
    <Document>
      <Page size="A4" style={cStyles.page}>
        {/* Header duas colunas */}
        <View style={cStyles.header}>
          <View style={cStyles.headerLeft}>
            <Text style={cStyles.headerName}>{ctx.nome}</Text>
            <Text style={cStyles.headerTitle}>{ctx.titulo}</Text>
          </View>
          <View style={cStyles.headerRight}>
            <Text style={cStyles.headerContact}>{ctx.localizacao}</Text>
            <Text style={cStyles.headerContact}>{ctx.telefone}</Text>
            <Text style={cStyles.headerContact}>{ctx.email}</Text>
            <Text style={cStyles.headerContact}>{ctx.linkedin}</Text>
            <Text style={cStyles.headerContact}>{ctx.github}</Text>
          </View>
        </View>

        {/* Resumo */}
        <CSection title="Resumo Profissional">
          <Text style={cStyles.summaryText}>{payload.resumo}</Text>
        </CSection>

        {/* Experiência */}
        <CSection title="Experiência">
          <CExpBlock empresa={ctx.empresas[0]} bullets={payload.exp_frog_bullets} />
          <CExpBlock empresa={ctx.empresas[1]} bullets={payload.exp_brasmid_bullets} separator />
          <CExpBlock empresa={ctx.empresas[2]} bullets={payload.exp_aapvr_bullets} separator />
        </CSection>

        {/* Habilidades */}
        <CSection title="Habilidades">
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Back-End:</Text><Text style={cStyles.skillValue}>{payload.hab_back}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Front-End:</Text><Text style={cStyles.skillValue}>{payload.hab_front}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Bancos de Dados:</Text><Text style={cStyles.skillValue}>{payload.hab_db}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Infraestrutura e DevOps:</Text><Text style={cStyles.skillValue}>{payload.hab_devops}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Arquitetura e IA:</Text><Text style={cStyles.skillValue}>{payload.hab_arq}</Text></View>
          <View style={cStyles.skillRow}><Text style={cStyles.skillLabel}>Segurança:</Text><Text style={cStyles.skillValue}>{payload.hab_seg}</Text></View>
        </CSection>

        {/* Formação */}
        <CSection title="Formação Acadêmica">
          {ctx.educacao.map((edu, i) => (
            <View key={i} style={cStyles.eduBlock}>
              <Text style={cStyles.eduTitle}>{edu.titulo}</Text>
              <Text style={cStyles.eduInstitution}>{edu.instituicao}</Text>
              <Text style={cStyles.eduPeriod}>{edu.periodo}</Text>
            </View>
          ))}
        </CSection>

        {/* Projetos */}
        <CSection title="Projetos e Desenvolvimento Contínuo">
          {payload.projetos_destaque.map((p, i) => (
            <View key={i} style={cStyles.projectBlock} wrap={false}>
              <Text style={cStyles.projectTitle}>{p.titulo}</Text>
              <Text style={cStyles.projectDesc}>{p.descricao}</Text>
            </View>
          ))}
        </CSection>
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
  classico:     { label: 'Clássico',     description: 'Nome em destaque, contatos à direita, seções com linha cinza. ATS-friendly.' },
  minimalista:  { label: 'Minimalista',  description: 'Clean, sem cores, tipografia pura. Elegante e atemporal.' },
};

export function buildCurriculoDocument(
  payload: CurriculoPayload,
  context: ProfissionalContext,
  template: TemplateId = 'classico'
) {
  switch (template) {
    case 'minimalista': return buildMinimalista(payload, context);
    default:            return buildClassico(payload, context);
  }
}
